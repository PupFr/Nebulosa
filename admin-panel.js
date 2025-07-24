// 🎨 Render Static Admin Panel
// Free hosting on Render for bot administration

const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.ADMIN_PORT || 10000;

// Database connection (PlanetScale)
const dbConfig = {
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  ssl: {
    rejectUnauthorized: false
  }
};

// Middleware
app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 🏠 Admin Dashboard Home
app.get('/', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    // Get platform health stats
    const [healthStats] = await connection.execute(`
      SELECT platform, status, AVG(response_time_ms) as avg_response_time,
             COUNT(*) as check_count, MAX(last_check) as last_check
      FROM platform_health 
      WHERE last_check > DATE_SUB(NOW(), INTERVAL 1 HOUR)
      GROUP BY platform, status
      ORDER BY platform
    `);
    
    // Get user count
    const [userCount] = await connection.execute('SELECT COUNT(*) as total FROM users');
    
    // Get recent bot usage
    const [recentUsage] = await connection.execute(`
      SELECT command, platform, COUNT(*) as usage_count,
             AVG(response_time_ms) as avg_response_time
      FROM bot_analytics 
      WHERE created_at > DATE_SUB(NOW(), INTERVAL 24 HOUR)
      GROUP BY command, platform
      ORDER BY usage_count DESC
      LIMIT 10
    `);
    
    await connection.end();
    
    res.render('dashboard', {
      title: 'Nebulosa Bot Admin',
      healthStats,
      userCount: userCount[0].total,
      recentUsage,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).send('Database connection error');
  }
});

// 📊 Analytics API Endpoint
app.get('/api/analytics', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const timeframe = req.query.timeframe || '24h';
    
    let timeCondition = 'DATE_SUB(NOW(), INTERVAL 24 HOUR)';
    if (timeframe === '7d') timeCondition = 'DATE_SUB(NOW(), INTERVAL 7 DAY)';
    if (timeframe === '30d') timeCondition = 'DATE_SUB(NOW(), INTERVAL 30 DAY)';
    
    const [analytics] = await connection.execute(`
      SELECT 
        command,
        platform,
        COUNT(*) as total_uses,
        AVG(response_time_ms) as avg_response_time,
        SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) as successful_uses,
        DATE(created_at) as usage_date
      FROM bot_analytics 
      WHERE created_at > ${timeCondition}
      GROUP BY command, platform, DATE(created_at)
      ORDER BY usage_date DESC, total_uses DESC
    `);
    
    await connection.end();
    res.json(analytics);
    
  } catch (error) {
    console.error('Analytics API error:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// 🏥 Health Check for Render
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    platform: 'render',
    service: 'admin-panel',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV
  });
});

// 🔧 Platform Status API
app.get('/api/status', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    const [platformStatus] = await connection.execute(`
      SELECT platform, status, response_time_ms, last_check, uptime_percentage
      FROM platform_health 
      WHERE last_check > DATE_SUB(NOW(), INTERVAL 5 MINUTE)
      ORDER BY platform, last_check DESC
    `);
    
    // Group by platform and get latest status
    const statusMap = {};
    platformStatus.forEach(status => {
      if (!statusMap[status.platform] || 
          new Date(status.last_check) > new Date(statusMap[status.platform].last_check)) {
        statusMap[status.platform] = status;
      }
    });
    
    await connection.end();
    
    res.json({
      platforms: statusMap,
      overall_status: Object.values(statusMap).every(s => s.status === 'healthy') ? 'healthy' : 'degraded',
      last_updated: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Status API error:', error);
    res.status(500).json({ error: 'Status check failed' });
  }
});

// 🚀 Start Admin Panel Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🎨 Nebulosa Admin Panel running on Render`);
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
  console.log(`💾 Database: ${process.env.DATABASE_NAME ? 'Connected' : 'Not configured'}`);
  console.log(`⏰ Started: ${new Date().toISOString()}`);
});

// 🛡️ Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Admin panel shutting down gracefully...');
  process.exit(0);
});

module.exports = app;

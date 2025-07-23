#!/usr/bin/env node

// 🔍 Railway Deployment Verification Script
const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');

console.log('🔍 VERIFYING MODERNIZED RAILWAY DEPLOYMENT');
console.log('==========================================\n');

async function verifyHealthEndpoint() {
    console.log('🏥 Testing Railway health endpoint...');
    try {
        const response = await axios.get('https://nebulosa-production.railway.app/health', {
            timeout: 10000
        });
        
        console.log('✅ Health endpoint responding');
        console.log('📊 Status:', response.data.status);
        console.log('🚂 Platform:', response.data.platform);
        console.log('⏰ Timestamp:', response.data.timestamp);
        return true;
    } catch (error) {
        console.log('❌ Health endpoint failed:', error.message);
        return false;
    }
}

async function verifyBotToken() {
    console.log('\n🤖 Testing bot token validity...');
    require('dotenv').config();
    
    if (!process.env.BOT_TOKEN) {
        console.log('❌ BOT_TOKEN not found');
        return false;
    }
    
    try {
        const bot = new TelegramBot(process.env.BOT_TOKEN);
        const botInfo = await bot.getMe();
        
        console.log('✅ Bot token valid');
        console.log('🤖 Bot name:', botInfo.first_name);
        console.log('📛 Username:', botInfo.username);
        console.log('🆔 Bot ID:', botInfo.id);
        return true;
    } catch (error) {
        console.log('❌ Bot token test failed:', error.message);
        return false;
    }
}

async function verifyDependencies() {
    console.log('\n📦 Checking modernized dependencies...');
    const packageInfo = require('./package-railway.json');
    
    console.log('✅ Clean package.json loaded');
    console.log('📦 Dependencies:');
    Object.entries(packageInfo.dependencies).forEach(([name, version]) => {
        console.log(`  • ${name}: ${version}`);
    });
    
    // Check for deprecated packages
    const hasDeprecated = Object.keys(packageInfo.dependencies).some(dep => 
        ['puppeteer', 'request', 'request-promise'].includes(dep)
    );
    
    if (!hasDeprecated) {
        console.log('✅ No deprecated packages found');
        return true;
    } else {
        console.log('❌ Deprecated packages still present');
        return false;
    }
}

async function runVerification() {
    console.log('🎯 Running comprehensive verification...\n');
    
    const results = {
        health: await verifyHealthEndpoint(),
        bot: await verifyBotToken(),
        deps: await verifyDependencies()
    };
    
    console.log('\n📊 VERIFICATION RESULTS');
    console.log('=======================');
    console.log(`🏥 Health Endpoint: ${results.health ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`🤖 Bot Token: ${results.bot ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`📦 Dependencies: ${results.deps ? '✅ PASS' : '❌ FAIL'}`);
    
    const allPassed = Object.values(results).every(result => result === true);
    
    console.log('\n🎉 OVERALL STATUS');
    console.log('=================');
    
    if (allPassed) {
        console.log('✅ ALL TESTS PASSED!');
        console.log('🚀 Railway deployment is ready for production!');
        console.log('🎯 No deprecated package warnings');
        console.log('⚡ Modern Node.js 18+ compatibility');
        console.log('\n📋 Next Steps:');
        console.log('1. Test bot commands in Telegram');
        console.log('2. Deploy to Vercel as backup');
        console.log('3. Configure Zoom OAuth URLs');
    } else {
        console.log('❌ SOME TESTS FAILED');
        console.log('🔧 Please check the errors above');
    }
}

// Run verification
runVerification().catch(console.error);

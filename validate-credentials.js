#!/usr/bin/env node

// 🔍 CREDENTIAL VALIDATION SCRIPT
console.log('🔍 VALIDATING ZOOM CREDENTIALS');
console.log('==============================');
console.log('');

require('dotenv').config();

const credentials = {
    botToken: process.env.BOT_TOKEN,
    zoomClientId: process.env.ZOOM_CLIENT_ID,
    zoomClientSecret: process.env.ZOOM_CLIENT_SECRET,
    redirectUri: process.env.ZOOM_REDIRECT_URI
};

console.log('📋 CURRENT CREDENTIALS:');
console.log('========================');
console.log(`BOT_TOKEN: ${credentials.botToken ? credentials.botToken.substring(0, 15) + '...' : 'MISSING'} (${credentials.botToken ? credentials.botToken.length : 0} chars)`);
console.log(`ZOOM_CLIENT_ID: ${credentials.zoomClientId || 'MISSING'} (${credentials.zoomClientId ? credentials.zoomClientId.length : 0} chars)`);
console.log(`ZOOM_CLIENT_SECRET: ${credentials.zoomClientSecret ? credentials.zoomClientSecret.substring(0, 15) + '...' : 'MISSING'} (${credentials.zoomClientSecret ? credentials.zoomClientSecret.length : 0} chars)`);
console.log(`ZOOM_REDIRECT_URI: ${credentials.redirectUri || 'MISSING'}`);
console.log('');

// Validation rules
const validationResults = [];

// Bot Token validation
if (!credentials.botToken) {
    validationResults.push('❌ BOT_TOKEN is missing');
} else if (credentials.botToken.length < 40) {
    validationResults.push('❌ BOT_TOKEN seems too short (should be ~46 characters)');
} else if (!credentials.botToken.includes(':')) {
    validationResults.push('❌ BOT_TOKEN format invalid (should contain colon)');
} else {
    validationResults.push('✅ BOT_TOKEN format looks correct');
}

// Zoom Client ID validation
if (!credentials.zoomClientId) {
    validationResults.push('❌ ZOOM_CLIENT_ID is missing');
} else if (credentials.zoomClientId.length < 15) {
    validationResults.push('❌ ZOOM_CLIENT_ID seems too short (should be ~22 characters)');
} else if (credentials.zoomClientId.length > 25) {
    validationResults.push('❌ ZOOM_CLIENT_ID seems too long (should be ~22 characters)');
} else {
    validationResults.push('✅ ZOOM_CLIENT_ID length looks correct');
}

// Zoom Client Secret validation  
if (!credentials.zoomClientSecret) {
    validationResults.push('❌ ZOOM_CLIENT_SECRET is missing');
} else if (credentials.zoomClientSecret.length < 30) {
    validationResults.push('❌ ZOOM_CLIENT_SECRET seems too short (should be ~32 characters)');
} else if (credentials.zoomClientSecret.length > 50) {
    validationResults.push('❌ ZOOM_CLIENT_SECRET seems too long (should be ~32 characters)');
} else if (credentials.zoomClientSecret !== 'qL0UeGFWeQM2Csu1Z1G2J4RAZt4QGzi6') {
    validationResults.push('⚠️ ZOOM_CLIENT_SECRET differs from expected value');
    console.log(`   Expected: qL0UeGFWeQM2Csu1Z1G2J4RAZt4QGzi6`);
    console.log(`   Got: ${credentials.zoomClientSecret}`);
} else {
    validationResults.push('✅ ZOOM_CLIENT_SECRET matches expected value');
}

// Redirect URI validation
if (!credentials.redirectUri) {
    validationResults.push('❌ ZOOM_REDIRECT_URI is missing');
} else if (!credentials.redirectUri.startsWith('https://')) {
    validationResults.push('❌ ZOOM_REDIRECT_URI must use HTTPS');
} else if (!credentials.redirectUri.includes('railway.app')) {
    validationResults.push('❌ ZOOM_REDIRECT_URI should point to Railway');
} else if (!credentials.redirectUri.includes('/oauth/callback')) {
    validationResults.push('❌ ZOOM_REDIRECT_URI should end with /oauth/callback');
} else {
    validationResults.push('✅ ZOOM_REDIRECT_URI format is correct');
}

console.log('🔍 VALIDATION RESULTS:');
console.log('======================');
validationResults.forEach(result => console.log(result));

// Overall status
const hasErrors = validationResults.some(result => result.startsWith('❌'));
const hasWarnings = validationResults.some(result => result.startsWith('⚠️'));

console.log('');
if (!hasErrors && !hasWarnings) {
    console.log('🎉 ALL VALIDATIONS PASSED!');
    console.log('✅ Ready for Railway deployment');
    process.exit(0);
} else if (!hasErrors && hasWarnings) {
    console.log('⚠️ VALIDATIONS PASSED WITH WARNINGS');
    console.log('✅ Should be ready for deployment, but double-check warnings');
    process.exit(0);
} else {
    console.log('❌ VALIDATION FAILED');
    console.log('🔧 Please fix the errors above before deploying');
    process.exit(1);
}

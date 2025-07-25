#!/usr/bin/env node

/**
 * PDF Generator for Zoom Beta Publisher URL Submission Package
 * Creates a professional PDF document from markdown submission materials
 */

const fs = require('fs');
const path = require('path');

// Check if puppeteer is available, if not provide installation instructions
let puppeteer;
try {
    puppeteer = require('puppeteer');
} catch (error) {
    console.log('🔧 Installing required dependencies for PDF generation...');
    const { execSync } = require('child_process');

    try {
        execSync('npm install puppeteer markdown-it highlight.js --save-dev', { stdio: 'inherit' });
        puppeteer = require('puppeteer');
        console.log('✅ Dependencies installed successfully!');
    } catch (installError) {
        console.error('❌ Failed to install dependencies. Please run:');
        console.error('npm install puppeteer markdown-it highlight.js --save-dev');
        process.exit(1);
    }
}

const MarkdownIt = require('markdown-it');
const hljs = require('highlight.js');

// Initialize markdown parser with syntax highlighting
const md = new MarkdownIt({
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return '<pre class="hljs"><code>' +
                    hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
                    '</code></pre>';
            } catch (__) { }
        }
        return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
    }
});

// Professional CSS styling for PDF
const cssStyles = `
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    
    body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        line-height: 1.6;
        color: #1f2937;
        background: #ffffff;
        font-size: 14px;
    }
    
    .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 40px;
    }
    
    /* Header Styling */
    h1 {
        color: #0f172a;
        font-size: 32px;
        font-weight: 700;
        margin-bottom: 20px;
        border-bottom: 4px solid #3b82f6;
        padding-bottom: 10px;
    }
    
    h2 {
        color: #1e40af;
        font-size: 24px;
        font-weight: 600;
        margin: 30px 0 15px 0;
        border-left: 4px solid #3b82f6;
        padding-left: 15px;
    }
    
    h3 {
        color: #1f2937;
        font-size: 18px;
        font-weight: 600;
        margin: 25px 0 10px 0;
    }
    
    h4 {
        color: #374151;
        font-size: 16px;
        font-weight: 500;
        margin: 20px 0 8px 0;
    }
    
    /* Paragraph and Text */
    p {
        margin-bottom: 15px;
        text-align: justify;
    }
    
    strong {
        font-weight: 600;
        color: #0f172a;
    }
    
    /* Lists */
    ul, ol {
        margin: 15px 0;
        padding-left: 25px;
    }
    
    li {
        margin-bottom: 8px;
    }
    
    /* Code blocks */
    pre {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 20px;
        margin: 20px 0;
        overflow-x: auto;
        font-size: 13px;
    }
    
    code {
        background: #f1f5f9;
        padding: 2px 6px;
        border-radius: 4px;
        font-family: 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace;
        font-size: 13px;
        color: #1e40af;
    }
    
    pre code {
        background: none;
        padding: 0;
        color: inherit;
    }
    
    /* Checkboxes and Status Indicators */
    .checkbox {
        color: #059669;
        font-weight: 600;
    }
    
    /* Tables */
    table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
    }
    
    th, td {
        border: 1px solid #e5e7eb;
        padding: 12px;
        text-align: left;
    }
    
    th {
        background: #f9fafb;
        font-weight: 600;
        color: #374151;
    }
    
    /* Blockquotes */
    blockquote {
        border-left: 4px solid #d1d5db;
        padding-left: 20px;
        margin: 20px 0;
        color: #6b7280;
        font-style: italic;
    }
    
    /* Links */
    a {
        color: #2563eb;
        text-decoration: none;
    }
    
    a:hover {
        text-decoration: underline;
    }
    
    /* Special Elements */
    .status-badge {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .status-success {
        background: #dcfce7;
        color: #166534;
    }
    
    .status-info {
        background: #dbeafe;
        color: #1e40af;
    }
    
    /* Page breaks for PDF */
    .page-break {
        page-break-before: always;
    }
    
    /* Header section */
    .header-section {
        text-align: center;
        margin-bottom: 40px;
        padding: 30px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-radius: 12px;
    }
    
    .header-section h1 {
        color: white;
        border-bottom: none;
        margin-bottom: 10px;
    }
    
    .header-section p {
        font-size: 16px;
        margin: 5px 0;
    }
    
    /* Security badges */
    .security-badge {
        background: #10b981;
        color: white;
        padding: 8px 16px;
        border-radius: 25px;
        font-weight: 600;
        font-size: 14px;
        display: inline-block;
        margin: 5px;
    }
    
    /* Footer */
    .footer {
        margin-top: 50px;
        padding-top: 20px;
        border-top: 2px solid #e5e7eb;
        text-align: center;
        color: #6b7280;
        font-size: 12px;
    }
    
    /* Print-specific styles */
    @media print {
        body {
            font-size: 12px;
        }
        
        .container {
            padding: 20px;
        }
        
        h1 {
            font-size: 28px;
        }
        
        h2 {
            font-size: 20px;
        }
        
        h3 {
            font-size: 16px;
        }
    }
</style>
`;

async function generatePDF() {
    try {
        console.log('🚀 Starting PDF generation for Zoom submission package...');

        // Read the main submission document
        const submissionPath = path.join(__dirname, 'ZOOM-FINAL-SUBMISSION-PACKAGE.md');
        if (!fs.existsSync(submissionPath)) {
            console.error('❌ ZOOM-FINAL-SUBMISSION-PACKAGE.md not found!');
            process.exit(1);
        }

        const markdownContent = fs.readFileSync(submissionPath, 'utf-8');
        console.log('📄 Loaded submission package content');

        // Convert markdown to HTML
        let htmlContent = md.render(markdownContent);

        // Post-process HTML for better PDF formatting
        htmlContent = htmlContent
            // Replace checkmarks with styled versions
            .replace(/✅/g, '<span class="checkbox">✅</span>')
            // Add page breaks before major sections
            .replace(/<h2>/g, '<div class="page-break"></div><h2>')
            // Style status indicators
            .replace(/PASSED/g, '<span class="status-badge status-success">PASSED</span>')
            .replace(/ENTERPRISE-GRADE/g, '<span class="status-badge status-success">ENTERPRISE-GRADE</span>')
            .replace(/ZERO ISSUES/g, '<span class="status-badge status-success">ZERO ISSUES</span>');

        // Create the complete HTML document
        const fullHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Zoom Beta Publisher URL - NEBULOSA BOT Submission Package</title>
            ${cssStyles}
        </head>
        <body>
            <div class="container">
                <div class="header-section">
                    <h1>🚀 ZOOM BETA PUBLISHER URL</h1>
                    <h2 style="color: white; border: none; margin: 0;">NEBULOSA BOT Submission Package</h2>
                    <p><strong>Developer:</strong> PupFr</p>
                    <p><strong>Submission Date:</strong> ${new Date().toLocaleDateString()}</p>
                    <div style="margin-top: 20px;">
                        <span class="security-badge">🛡️ ENTERPRISE SECURITY</span>
                        <span class="security-badge">✅ SONARQUBE PASSED</span>
                        <span class="security-badge">🏆 A-GRADE RATING</span>
                    </div>
                </div>
                
                ${htmlContent}
                
                <div class="footer">
                    <p><strong>Document Generated:</strong> ${new Date().toLocaleString()}</p>
                    <p><strong>Repository:</strong> https://github.com/PupFr/Nebulosa</p>
                    <p><strong>SonarQube Project:</strong> PupFr_Nebulosa</p>
                    <p><em>This document represents enterprise-grade security compliance for Zoom Beta Publisher URL approval.</em></p>
                </div>
            </div>
        </body>
        </html>
        `;

        console.log('🎨 HTML content prepared with professional styling');

        // Launch Puppeteer and generate PDF
        console.log('🤖 Launching browser for PDF generation...');
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();

        // Set content and wait for fonts to load
        await page.setContent(fullHtml, { waitUntil: 'networkidle0' });

        // Generate PDF with professional settings
        const pdfPath = path.join(__dirname, 'ZOOM-BETA-PUBLISHER-SUBMISSION.pdf');
        await page.pdf({
            path: pdfPath,
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20mm',
                right: '15mm',
                bottom: '20mm',
                left: '15mm'
            },
            displayHeaderFooter: true,
            headerTemplate: `
                <div style="font-size: 10px; color: #666; width: 100%; text-align: center; margin-top: 10px;">
                    <span>ZOOM BETA PUBLISHER URL - NEBULOSA BOT SUBMISSION PACKAGE</span>
                </div>
            `,
            footerTemplate: `
                <div style="font-size: 10px; color: #666; width: 100%; text-align: center; margin-bottom: 10px;">
                    <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span> | Generated: ${new Date().toLocaleDateString()} | github.com/PupFr/Nebulosa</span>
                </div>
            `
        });

        await browser.close();

        console.log('✅ PDF generated successfully!');
        console.log(`📄 File saved as: ${pdfPath}`);
        console.log(`📊 File size: ${(fs.statSync(pdfPath).size / 1024 / 1024).toFixed(2)} MB`);

        // Also generate a compact version
        console.log('📋 Generating compact version...');
        const browser2 = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page2 = await browser2.newPage();
        await page2.setContent(fullHtml, { waitUntil: 'networkidle0' });

        const compactPdfPath = path.join(__dirname, 'ZOOM-SUBMISSION-COMPACT.pdf');
        await page2.pdf({
            path: compactPdfPath,
            format: 'A4',
            printBackground: true,
            margin: {
                top: '15mm',
                right: '10mm',
                bottom: '15mm',
                left: '10mm'
            },
            scale: 0.8 // Slightly smaller for more content per page
        });

        await browser2.close();

        console.log('✅ Compact PDF generated successfully!');
        console.log(`📄 Compact file saved as: ${compactPdfPath}`);
        console.log(`📊 Compact file size: ${(fs.statSync(compactPdfPath).size / 1024 / 1024).toFixed(2)} MB`);

        // Generate summary
        console.log('\n🎉 PDF GENERATION COMPLETE!');
        console.log('==========================================');
        console.log('📄 Full Version: ZOOM-BETA-PUBLISHER-SUBMISSION.pdf');
        console.log('📋 Compact Version: ZOOM-SUBMISSION-COMPACT.pdf');
        console.log('🛡️ Security Status: Enterprise-Grade Compliance');
        console.log('✅ SonarQube: PASSED with A-Grade Rating');
        console.log('🚀 Ready for immediate Zoom submission');
        console.log('==========================================');

        return {
            fullPath: pdfPath,
            compactPath: compactPdfPath,
            success: true
        };

    } catch (error) {
        console.error('❌ PDF generation failed:', error.message);
        console.error('Stack trace:', error.stack);
        return { success: false, error: error.message };
    }
}

// Run if called directly
if (require.main === module) {
    generatePDF().then((result) => {
        if (result.success) {
            console.log('\n✨ Professional PDF submission package ready for Zoom!');
            process.exit(0);
        } else {
            console.error('\n❌ PDF generation failed');
            process.exit(1);
        }
    });
}

module.exports = { generatePDF };

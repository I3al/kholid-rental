#!/usr/bin/env node
/**
 * Auto-update Google Search Console verification code ke HTML
 * Usage: node scripts/update-gsc-verification.js <verification-code>
 * Example: node scripts/update-gsc-verification.js abc123xyz456def789
 */

const fs = require('fs');
const path = require('path');

const verificationCode = process.argv[2];
const indexPath = path.join(__dirname, '../index.html');

if (!verificationCode) {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║  Google Search Console Auto-Verification Updater              ║
╚═══════════════════════════════════════════════════════════════╝

📝 USAGE:
  node scripts/update-gsc-verification.js <verification-code>

📋 EXAMPLE:
  node scripts/update-gsc-verification.js abc123xyz456def789

🔍 HOW TO GET VERIFICATION CODE:
  1. Open: https://search.google.com/search-console
  2. Add property: https://kholidrental.com
  3. Select "HTML tag" verification method
  4. Copy the code inside content="..."
  5. Run this script with that code

⚡ THEN:
  1. Verify di Google Search Console
  2. git add & push changes
  3. Submit sitemap!

`);
  process.exit(1);
}

try {
  // Read HTML file
  let html = fs.readFileSync(indexPath, 'utf8');

  // Update verification code
  const oldPattern = /meta name="google-site-verification" content="[^"]*"/;
  const newMeta = `meta name="google-site-verification" content="${verificationCode}"`;

  if (html.includes('google-site-verification')) {
    html = html.replace(oldPattern, newMeta);
    console.log('✅ Verification code updated in index.html');
  } else {
    console.error('❌ Verification meta tag not found in index.html');
    process.exit(1);
  }

  // Write updated HTML
  fs.writeFileSync(indexPath, html, 'utf8');

  console.log(`
✅ SUCCESS! Updated index.html with verification code

🔐 Verification Code: ${verificationCode}

📋 NEXT STEPS:
  1. Commit & push changes:
     git add index.html
     git commit -m "Add Google Search Console verification"
     git push origin main

  2. Open Google Search Console:
     https://search.google.com/search-console

  3. Click "Verify" button to confirm

  4. Submit Sitemap:
     GSC → Sitemaps → Add: sitemap.xml

🎉 Done! Google will start crawling your site!

`);

  process.exit(0);
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}

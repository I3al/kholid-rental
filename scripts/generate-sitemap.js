#!/usr/bin/env node
/**
 * Auto-generate sitemap.xml untuk SEO
 * Script ini otomatis dijalankan saat deployment
 */

const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://kholidrental.com';
const PRIORITY_MAP = {
  '/': 1.0,
  '/#fleet': 0.9,
  '/#services': 0.8,
  '/#why': 0.8,
  '/#how': 0.8,
  '/#faq': 0.8,
  '/#contact': 0.7,
  '/#testimonials': 0.7
};

const generateSitemap = () => {
  const now = new Date().toISOString().split('T')[0];

  const urls = Object.entries(PRIORITY_MAP).map(([path, priority]) => `    <url>
        <loc>${DOMAIN}${path}</loc>
        <lastmod>${now}</lastmod>
        <changefreq>${priority > 0.8 ? 'weekly' : 'monthly'}</changefreq>
        <priority>${priority}</priority>
    </url>`).join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>
`;

  return sitemap;
};

try {
  const sitemap = generateSitemap();
  const outputPath = path.join(__dirname, '../sitemap.xml');
  fs.writeFileSync(outputPath, sitemap, 'utf8');
  console.log('✅ sitemap.xml generated successfully');
  process.exit(0);
} catch (error) {
  console.error('❌ Error generating sitemap:', error);
  process.exit(1);
}

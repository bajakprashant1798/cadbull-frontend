import axios from 'axios';

// Helper function to escape special XML characters
const escapeXml = (unsafe) => {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
};

export default async function handler(req, res) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_FRONT_URL;
    
    // ✅ CORRECTED: Call the new /api/categories/sitemap endpoint
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_MAIN}/categories/sitemap`);
    const categories = response.data.categories || [];

    res.setHeader('Content-Type', 'text/xml');
    res.write(`<?xml version="1.0" encoding="UTF-8"?>\n`);
    res.write(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`);

    for (const cat of categories) {
      const lastmod = cat.timestamp && !isNaN(new Date(cat.timestamp))
        ? new Date(cat.timestamp).toISOString()
        : new Date().toISOString();

      res.write(`
        <url>
          <loc>${escapeXml(`${baseUrl}/${cat.slug}`)}</loc>
          <lastmod>${lastmod}</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.6</priority>
        </url>
      `);
    }

    res.write(`</urlset>`);
    res.end();
  } catch (error) {
    console.error("Error generating categories sitemap:", error);
    res.status(500).end();
  }
};
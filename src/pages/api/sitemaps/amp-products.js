import axios from 'axios';

// Fallback slug generator
const slugify = (text) => {
  if (!text) return '';
  return text.trim().replace(/\s+/g, '-');
};

export default async function handler(req, res) {
  try {
    const { page = 1 } = req.query;
    const baseUrl = process.env.NEXT_PUBLIC_FRONT_URL;
    const productsPerPage = 5000;

    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_MAIN}/projects?page=${page}&pageSize=${productsPerPage}`);
    const products = response.data.products || [];

    // Set the XML content type header
    res.setHeader('Content-Type', 'text/xml');
    
    // Manually build the XML string
    res.write(`<?xml version="1.0" encoding="UTF-8"?>\n`);
    res.write(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`);

    for (const product of products) {
      const lastmod = product.timestamp && !isNaN(new Date(product.timestamp))
        ? new Date(product.timestamp).toISOString()
        : new Date().toISOString();

      // Use the slug from the database if it exists, otherwise create one
      const finalSlug = product.slug || slugify(product.work_title);

      res.write(`
        <url>
          <loc>${baseUrl}/amp/${product.id}/${encodeURIComponent(finalSlug)}</loc>
          <lastmod>${lastmod}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.8</priority>
        </url>
      `);
    }

    res.write(`</urlset>`);
    res.end();
  } catch (error) {
    console.error("Error generating AMP product sitemap:", error);
    res.status(500).end();
  }
};
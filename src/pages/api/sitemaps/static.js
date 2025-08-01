export default async function handler(req, res) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_FRONT_URL;
    const pages = ['/about-us', '/contact-us', '/faqs', '/terms-condition', '/privacy-policy', '/pricing'];

    // Set the XML content type header
    res.setHeader('Content-Type', 'text/xml');
    
    // Manually build the XML string
    res.write(`<?xml version="1.0" encoding="UTF-8"?>\n`);
    res.write(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`);

    for (const page of pages) {
      res.write(`
        <url>
          <loc>${baseUrl}${page}</loc>
          <changefreq>yearly</changefreq>
          <priority>0.5</priority>
        </url>
      `);
    }

    res.write(`</urlset>`);
    res.end();

  } catch (error) {
    console.error("Error generating static sitemap:", error);
    res.status(500).end();
  }
};
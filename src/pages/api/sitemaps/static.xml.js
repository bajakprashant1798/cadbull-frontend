import { getServerSideSitemapLegacy } from 'next-sitemap';

export default async function handler(req, res) {
  const baseUrl = process.env.NEXT_PUBLIC_FRONT_URL;
  const pages = ['/about-us', '/contact-us', '/faqs', '/terms-condition', '/privacy-policy', '/pricing'];

  const fields = pages.map(page => ({
    loc: `${baseUrl}${page}`,
    changefreq: 'yearly',
    priority: 0.5,
  }));

  // getServerSideSitemapLegacy returns a response object
  const sitemapResponse = await getServerSideSitemapLegacy(fields);

  // Set headers and send the XML
  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemapResponse.body);
  res.end();
};
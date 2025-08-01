import { getServerSideSitemapIndexLegacy } from 'next-sitemap';
import axios from 'axios';

export const getServerSideProps = async (ctx) => {
  // Fetch the total number of products from your API
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_MAIN}/projects`);
  const totalProducts = response.data.totalProducts || 0;
  const productsPerPage = 5000;
  const totalProductPages = Math.ceil(totalProducts / productsPerPage);

  const sitemapUrls = [];
  const baseUrl = process.env.NEXT_PUBLIC_FRONT_URL;

  // These URLs point to your API routes
  sitemapUrls.push(`${baseUrl}/api/sitemaps/static`);
  sitemapUrls.push(`${baseUrl}/api/sitemaps/categories`);
  
  // Generate a URL for each page of products
  for (let i = 1; i <= totalProductPages; i++) {
    sitemapUrls.push(`${baseUrl}/api/sitemaps/products?page=${i}`);
    sitemapUrls.push(`${baseUrl}/api/sitemaps/amp-products?page=${i}`);
  }

  return getServerSideSitemapIndexLegacy(ctx, sitemapUrls);
};

export default function SitemapIndex() {}
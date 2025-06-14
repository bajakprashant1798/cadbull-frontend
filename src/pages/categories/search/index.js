import SearchCategories from "./[page]";

SearchCategoriesIndex.getLayout = SearchCategories.getLayout;
export default function SearchCategoriesIndex(props) {
  // Pass page=1 to the dynamic page component
  return <SearchCategories {...props} />;
}

// SSR/SSG support:
export async function getServerSideProps(ctx) {
  // Forward to [page].js as page=1
  ctx.query.page = "1";
  // Dynamically import and reuse the same logic:
  const mod = await import("./[page]");
  if (mod.getServerSideProps) {
    return mod.getServerSideProps({ ...ctx, params: ctx.params });
  }
  return { props: {} };
}

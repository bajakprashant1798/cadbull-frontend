import CategoriesPage from "./[page]";

// This makes sure getLayout is available on the main export!
CategoriesIndex.getLayout = CategoriesPage.getLayout;

export default function CategoriesIndex(props) {
  return <CategoriesPage {...props} page={1} />;
}

export { getStaticProps } from "./[page]";

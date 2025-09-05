import CadLandscaping from "./[page]";
IndexPage.getLayout = CadLandscaping.getLayout;
export default function IndexPage(props) {
  return <CadLandscaping {...props} page={1} />;
}
// ✅ SSR: Export getServerSideProps instead of getStaticProps/getStaticPaths
export { getServerSideProps } from "./[page]";

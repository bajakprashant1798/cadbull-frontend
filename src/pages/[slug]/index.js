import CadLandscaping from "./[page]";
export default function IndexPage(props) {
  return <CadLandscaping {...props} page={1} />;
}
export { getStaticPaths, getStaticProps } from "./[page]";

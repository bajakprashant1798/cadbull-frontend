import HousePlanPage from "./[page]";

HousePlanIndex.getLayout = HousePlanPage.getLayout;

export default function HousePlanIndex(props) {
  return <HousePlanPage {...props} page={1} />;
}

export { getStaticProps } from "./[page]";

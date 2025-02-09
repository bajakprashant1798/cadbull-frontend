import AdminLayout from "@/layouts/AdminLayout";
import CategoryTable from "@/components/CategoryTable";

const AllCategories = () => {
  return <CategoryTable status="" title="All Categories" />;
};

AllCategories.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default AllCategories;

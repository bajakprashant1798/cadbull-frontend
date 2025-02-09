import AdminLayout from "@/layouts/AdminLayout";
import CategoryTable from "@/components/CategoryTable";

const InactiveCategories = () => {
  return <CategoryTable status="2" title="Inactive Categories" />;
};

InactiveCategories.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default InactiveCategories;

import AdminLayout from "@/layouts/AdminLayout";
import CategoryTable from "@/components/CategoryTable";

const ActiveCategories = () => {
  return <CategoryTable status="1" title="Active Categories" />;
};

ActiveCategories.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default ActiveCategories;

import AdminLayout from "@/layouts/AdminLayout";
import UserTable from "@/components/UserTable";

const ViewDataOperators = () => {
  return <UserTable role="4" title="View Data Operators" />;
};

ViewDataOperators.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default ViewDataOperators;

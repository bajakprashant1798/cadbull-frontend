import AdminLayout from "@/layouts/AdminLayout";
import UserTable from "@/components/UserTable";

const ViewContentCreators = () => {
  return <UserTable role="5" title="View Content Creators" />;
};

ViewContentCreators.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default ViewContentCreators;

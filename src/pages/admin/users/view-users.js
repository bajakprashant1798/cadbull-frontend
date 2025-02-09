import AdminLayout from "@/layouts/AdminLayout";
import UserTable from "@/components/UserTable";

const ViewUsers = () => {
  return <UserTable role="2" title="View Users" />;
};

ViewUsers.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default ViewUsers;

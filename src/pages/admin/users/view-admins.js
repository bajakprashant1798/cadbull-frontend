import AdminLayout from "@/layouts/AdminLayout";
import UserTable from "@/components/UserTable";

const ViewAdmins = () => {
  return <UserTable role="1" title="View Admins" />;
};

ViewAdmins.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default ViewAdmins;

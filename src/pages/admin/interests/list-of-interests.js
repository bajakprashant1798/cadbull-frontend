import { useSelector } from "react-redux";
import { useState } from "react";
import { getInterestsApi, deleteInterestApi } from "@/service/api";
import { toast } from "react-toastify";
import AdminLayout from "@/layouts/AdminLayout";
import TableComponent from "@/components/TableComponent";

const ListInterests = () => {
  const { token } = useSelector((store) => store.logininfo);
  const [interests, setInterests] = useState([]); // ✅ State to hold interests

  // ✅ Fetch Interests API Function
  const fetchInterests = async (page, perPage, search) => {
    try {
      const response = await getInterestsApi(page, perPage, search);
      setInterests(response.data.interests); // ✅ Store data in state
      return { 
        data: response.data.interests, 
        totalPages: response.data.totalPages 
      };
    } catch (error) {
      toast.error("Error fetching interests");
      return { data: [], totalPages: 1 };
    }
  };

  // ✅ Delete Interest & Remove from UI
  const deleteInterest = async (id) => {
    try {
      await deleteInterestApi(id, token);
      setInterests((prev) => prev.filter((interest) => interest.id !== id)); // ✅ Remove instantly
      toast.success("Interest deleted successfully!");
    } catch (error) {
      toast.error("Error deleting interest");
    }
  };

  return (
    <AdminLayout>
      <div className="container py-5">
        <h2>List of Interests</h2>
        <TableComponent
          fetchData={fetchInterests}
          deleteHandler={deleteInterest}
          editPath="/admin/interests/edit-interest"
          columnName="interest"
          data={interests} // ✅ Pass data state
          setData={setInterests} // ✅ Pass setter function
        />
      </div>
    </AdminLayout>
  );
};

export default ListInterests;

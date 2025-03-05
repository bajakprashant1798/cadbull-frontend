import { useSelector } from "react-redux";
import { useState } from "react";
import { getOccupationsApi, deleteOccupationApi } from "@/service/api";
import { toast } from "react-toastify";
import AdminLayout from "@/layouts/AdminLayout";
import TableComponent from "@/components/TableComponent";

const ListOccupations = () => {
  // const { token } = useSelector((store) => store.logininfo);
  const [occupations, setOccupations] = useState([]); // ✅ State to hold occupations

  // ✅ Fetch Occupations API Function with Pagination
  const fetchOccupations = async (page, perPage, search) => {
    try {
      const response = await getOccupationsApi(page, perPage, search);
      setOccupations(response.data.occupations); // ✅ Store data in state
      return {
        data: response.data.occupations,
        totalPages: response.data.totalPages,
        totalEntries: response.data.totalEntries, 
      };
    } catch (error) {
      toast.error("Error fetching occupations");
      return { data: [], totalPages: 1, totalEntries: 0 };
    }
  };

  // ✅ Delete Occupation & Remove from UI
  const deleteOccupation = async (id) => {
    try {
      await deleteOccupationApi(id);
      setOccupations((prev) => prev.filter((occ) => occ.id !== id)); // ✅ Remove instantly
      toast.success("Occupation deleted successfully!");
    } catch (error) {
      toast.error("Error deleting occupation");
    }
  };

  return (
    <AdminLayout>
      <div className="container py-5">
        <h2>List of Occupations</h2>
        <TableComponent
          fetchData={fetchOccupations}
          deleteHandler={deleteOccupation}
          editPath="/admin/occupations/edit-occupation"
          columnName="occupation"
          data={occupations} // ✅ Pass data state
          setData={setOccupations} // ✅ Pass setter function
        />
      </div>
    </AdminLayout>
  );
};

export default ListOccupations;

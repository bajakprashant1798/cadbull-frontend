import { useState } from "react";
import { useSelector } from "react-redux";
import { getSearchWordsApi, deleteSearchWordApi } from "@/service/api";
import { toast } from "react-toastify";
import AdminLayout from "@/layouts/AdminLayout";
import TableComponent from "@/components/TableComponent";

const SearchWords = () => {
  const { token } = useSelector((store) => store.logininfo);
  const [searchWords, setSearchWords] = useState([]); // ✅ Local State for UI Update

  // ✅ Fetch Search Words
  const fetchSearchWords = async (page, perPage, search) => {
    const response = await getSearchWordsApi(page, perPage, search);
    setSearchWords(response.data.words); // ✅ Update local state when fetching
    return { data: response.data.words, totalPages: response.data.totalPages, totalEntries: response.data.totalEntries };
  };

  // ✅ Delete Word & Update State
  const deleteSearchWord = async (id) => {
    try {
      await deleteSearchWordApi(id);
      toast.success("Search word deleted successfully!");

      // ✅ Remove deleted word from state immediately
      setSearchWords((prevWords) => prevWords.filter(word => word.id !== id));
    } catch (error) {
      toast.error("Error deleting search word");
    }
  };

  return (
    <AdminLayout>
      <div className="container py-5">
        <h2>Search Words</h2>
        <TableComponent
          fetchData={fetchSearchWords}
          deleteHandler={deleteSearchWord}
          editPath="" // No edit option for search words
          columnName="word"
          showEdit={false} // Disable Edit Button
          data={searchWords} // ✅ Pass Local State to Table
          setData={setSearchWords} // ✅ Allow TableComponent to modify state
        />
      </div>
    </AdminLayout>
  );
};

export default SearchWords;

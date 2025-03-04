import { useEffect, useState } from "react";
import CategoriesList from "@/components/CategoriesList";
import SearchCategories from "@/components/SearchCategories";
import { getallCategories } from "@/service/api";

const SubAndMainCategoriesSidebar = ({ type, subcategories }) => {
  const [mainCategories, setMainCategories] = useState([]);

  useEffect(() => {
    // Only fetch main categories when the sidebar type is "Sub Categories"
    if (type === "Sub Categories") {
      getallCategories("")
        .then((res) => {
          if (res.data.categories) {
            setMainCategories(res.data.categories);
          }
        })
        .catch((err) =>
          console.error("Error fetching main categories:", err)
        );
    }
  }, [type]);

  return (
    <>
      {/* First Sidebar: Subcategories */}
      <div className="mb-4">
        <SearchCategories categories={subcategories} type="Sub Categories" />
      </div>
      {/* Second Sidebar: Main Categories */}
      {mainCategories.length > 0 && (
        <div className="mb-4">
          <h5 className="bg-secondary text-white px-3 py-2">Categories</h5>
          <div className="p-3">
            <ul className="list-unstyled">
              {mainCategories.map((cat, index) => (
                <CategoriesList key={index} {...cat} />
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default SubAndMainCategoriesSidebar;

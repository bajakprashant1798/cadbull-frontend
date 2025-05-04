import { useState, useEffect, Fragment } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Head from "next/head";
import MainLayout from "@/layouts/MainLayout";
import PageHeading from "@/components/PageHeading";
import SectionHeading from "@/components/SectionHeading";
import Pagination from "@/components/Pagination";
import { getOccupations, addExperience, getExperiences } from "@/service/api"; // Import API functions
import { parse } from "cookie";

const Experiences = ({ initialOccupations, initialExperiences }) => {
  // const { token } = useSelector((store) => store.logininfo); // Get user token
  const [occupations, setOccupations] = useState(initialOccupations || []);
  const [experiences, setExperiences] = useState(initialExperiences || []);
  console.log(initialExperiences, "initialExperiences");
  
  const [formData, setFormData] = useState({
    company_name: "",
    occupation: "",
    from: "",
    to: "",
    post: "",
  });

  // ✅ Fetch Occupations on Component Mount
  useEffect(() => {
    setExperiences(initialExperiences); // Set initial experiences from props
    setOccupations(initialOccupations); // Set initial occupations from props
    // fetchOccupations();
    // fetchExperiences();
  }, []);

  const fetchOccupations = async () => {
    try {
      const response = await getOccupations();
      setOccupations(response.data.occupations);
    } catch (error) {
      console.error("❌ Error fetching occupations:", error);
    }
  };

  const fetchExperiences = async () => {
    try {
      const response = await getExperiences();
      setExperiences(response.data.experiences);
    } catch (error) {
      console.error("❌ Error fetching experiences:", error);
    }
  };

  // ✅ Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.company_name || !formData.occupation || !formData.from || !formData.to || !formData.post) {
      return toast.error("All fields are required.");
    }

    try {
      await addExperience(formData);
      toast.success("Experience added successfully!");
      setFormData({ company_name: "", occupation: "", from: "", to: "", post: "" }); // Reset Form
      fetchExperiences(); // Refresh the table
    } catch (error) {
      toast.error("Error adding experience.");
    }
  };

  return (
    <Fragment>
      <Head>
        <title>Experiences | Cadbull</title>
        <meta name="description" content="World's Largest 2D CAD Library." />
      </Head>

      <section className="py-lg-5 py-4 experience-page">
        <div className="container">
          <PageHeading title={"Experiences"} description={"Choose from 254195+ Free & Premium CAD Files with new additions published every second month"} />

          <div className="row">
            <div className="col-md-12">
              <form onSubmit={handleSubmit}>
                <div className="form-wrapper rounded-xxl p-3 p-md-5">
                  <h5 className="text-primary">Add <span className="fw-bold">Experience</span></h5>
                  <div className="row g-3">
                    {/* Company Name */}
                    <div className="col-md-6">
                      <label>Company</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Company Name"
                        value={formData.company_name}
                        onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                      />
                    </div>

                    {/* Occupation Dropdown */}
                    <div className="col-md-6">
                      <label>Occupation</label>
                      <select
                        className="form-select"
                        value={formData.occupation}
                        onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                      >
                        <option value="">Select Occupation</option>
                        {occupations.map((occ) => (
                          <option key={occ.id} value={occ.occupation}>{occ.occupation}</option>
                        ))}
                      </select>
                    </div>

                    {/* From Date */}
                    <div className="col-md-6">
                      <label>From</label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.from}
                        onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                      />
                    </div>

                    {/* To Date */}
                    <div className="col-md-6">
                      <label>To</label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.to}
                        onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                      />
                    </div>

                    {/* Post */}
                    <div className="col-md-6">
                      <label>Post</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Your Post"
                        value={formData.post}
                        onChange={(e) => setFormData({ ...formData, post: e.target.value })}
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="col-md-6 d-flex align-items-end">
                      <button type="submit" className="btn btn-secondary rounded-2 w-100">Add Experience</button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

        </div>
      </section>

      {/* ✅ Experiences Table */}
      <section className="py-3 py-md-4">
        <div className="container">
          <SectionHeading subHeading="" mainHeading="Current" mainHeadingBold="Experiences" />
          <div className="row justify-content-center mx-2">
            <div className="col-md-12 form-wrapper rounded-xl p-0 overflow-hidden">
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <td>Company</td>
                      <td>Occupation</td>
                      <td>From</td>
                      <td>To</td>
                      <td>Post</td>
                    </tr>
                  </thead>
                  <tbody>
                    {experiences.length > 0 ? experiences.map((exp) => (
                      <tr key={exp.id}>
                        <td>{exp.company_name}</td>
                        <td>{exp.occupation}</td>
                        <td>{exp.from}</td>
                        <td>{exp.to}</td>
                        <td>{exp.post}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="5" className="text-center">No experiences found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* Pagination */}
          {/* <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            goToPreviousPage={() => handlePageChange(currentPage - 1)}
            goToNextPage={() => handlePageChange(currentPage + 1)}
            dispatchCurrentPage={handlePageChange}
          /> */}
        </div>
      </section>
    </Fragment>
  );
}

export async function getServerSideProps({ req }) {
  const cookies = parse(req.headers.cookie || '');
  const accessToken = cookies.accessToken;

  if (!accessToken) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  try {
    const occupationsRes = await getOccupations(accessToken);
    const experiencesRes = await getExperiences(accessToken);

    return {
      props: {
        initialOccupations: occupationsRes.data.occupations || [],
        initialExperiences: experiencesRes.data.experiences || [],
      },
    };
  } catch (error) {
    console.error("❌ Error in getServerSideProps:", error);
    return {
      props: {
        initialOccupations: [],
        initialExperiences: [],
      },
    };
  }
}


Experiences.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};

export default Experiences;

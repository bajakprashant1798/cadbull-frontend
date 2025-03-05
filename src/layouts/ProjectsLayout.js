// src/layouts/ProjectsLayout.js
import { Fragment, useState } from "react";
import PageHeading from "@/components/PageHeading";
import { useSelector } from "react-redux";
import { createUserProject } from "@/service/api";
import { toast } from "react-toastify";
import UploadFiles from "@/components/UploadFile";

const ProjectsLayout = ({ children }) => {
  const [formValues, setFormValues] = useState({
    title: "",
    role: "",
    location: "",
    keywords: "",
    projectType: "",
    designer: "",
    year: "",
    manufacturers: "",
    structuralEngineering: "",
    civilEngineering: "",
    details: "",
    image: null, // only one file to be uploaded (the image)
  });

  // Retrieve token and user data from Redux
  const { token, user } = useSelector((store) => store.logininfo);

  // Handle text and select input changes
  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  // Handle file input change
  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFormValues((prev) => ({ ...prev, image: files[0] }));
      toast.success("Project image selected!");
    }
  };

  // Callback for image upload; UploadFiles component will trigger this
  const handleUploadImage = (files) => {
    if (files && files.length > 0) {
      setFormValues((prev) => ({ ...prev, image: files[0] }));
      toast.success("Project image selected!");
    }
  };

  // Handle form submission: create FormData and call API
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formValues.image) {
      toast.error("Please upload a project image.");
      return;
    }
    if (!user || !user.id) {
      toast.error("User not found. Please log in.");
      return;
    }
    try {
      // Build a FormData object
      const data = new FormData();
      data.append("title", formValues.title);
      data.append("role", formValues.role);
      data.append("location", formValues.location);
      data.append("keywords", formValues.keywords);
      data.append("project_type", formValues.projectType);
      data.append("description", formValues.details);
      data.append("user_id", user.id);
      data.append("image", formValues.image); // Must match backend (.single("image"))

      // Call the API handler (createUserProject expects FormData and token)
      await createUserProject(data);
      toast.success("Project uploaded successfully! Pending approval.");
      // Reset the form if needed
      setFormValues({
        title: "",
        role: "",
        location: "",
        keywords: "",
        projectType: "",
        designer: "",
        year: "",
        manufacturers: "",
        structuralEngineering: "",
        civilEngineering: "",
        details: "",
        image: null,
      });
    } catch (error) {
      console.error("Error uploading project:", error);
      toast.error("Upload failed. Please try again.");
    }
  };

  return (
    <Fragment>
      <section className="py-lg-5 py-4 auth-page">
        <div className="container">
          {/* Page Heading */}
          <div className="row">
            <div className="col-md-12">
              <PageHeading
                title={"Projects"}
                description={
                  "Choose from 254195+ Free & Premium CAD Files with new additions published every second month"
                }
              />
            </div>
          </div>
          {/* Add Project Form */}
          <div className="row align-items-center">
            <div className="col-md-12">
              <form onSubmit={handleSubmit}>
                <div className="form-wrapper rounded-xxl p-3 p-md-5 mb-md-5 mb-4">
                  <div className="row g-3">
                    {/* Title */}
                    <div className="col-md-6 col-lg-6">
                      <label>Title</label>
                      <input
                        type="text"
                        name="title"
                        className="form-control"
                        placeholder="Enter Your Title"
                        value={formValues.title}
                        onChange={handleChange}
                      />
                    </div>
                    {/* Role */}
                    <div className="col-md-6 col-lg-6">
                      <label>Role</label>
                      <select
                        name="role"
                        className="form-select"
                        aria-label="Role"
                        value={formValues.role}
                        onChange={handleChange}
                      >
                        <option value="">Select Role</option>
                        <option value="Architect">Architect</option>
                        <option value="Designer">Designer</option>
                        <option value="Engineer">Engineer</option>
                      </select>
                    </div>
                    {/* Location */}
                    <div className="col-md-6 col-lg-6">
                      <label>Location</label>
                      <input
                        type="text"
                        name="location"
                        className="form-control"
                        placeholder="Type Location"
                        value={formValues.location}
                        onChange={handleChange}
                      />
                    </div>
                    {/* Keywords */}
                    <div className="col-md-6 col-lg-6">
                      <label>Keywords</label>
                      <input
                        type="text"
                        name="keywords"
                        className="form-control"
                        placeholder="Type Keywords"
                        value={formValues.keywords}
                        onChange={handleChange}
                      />
                    </div>
                    {/* Project Type */}
                    <div className="col-md-6 col-lg-6">
                      <label>Project Type</label>
                      <select
                        name="projectType"
                        className="form-select"
                        aria-label="Project Type"
                        value={formValues.projectType}
                        onChange={handleChange}
                      >
                        <option value="">Select Project Type</option>
                        <option value="Owned">
                          My project - I own or built this
                        </option>
                        <option value="Collaborative">
                          Collaborative project
                        </option>
                      </select>
                    </div>
                    {/* Designer */}
                    <div className="col-md-6 col-lg-6">
                      <label className="no-required">Designer</label>
                      <input
                        type="email"
                        name="designer"
                        className="form-control"
                        placeholder="Enter Your Designer"
                        value={formValues.designer}
                        onChange={handleChange}
                      />
                    </div>
                    {/* Year */}
                    <div className="col-md-6 col-lg-6">
                      <label className="no-required">Year</label>
                      <input
                        type="date"
                        name="year"
                        className="form-control"
                        placeholder="Enter Year"
                        value={formValues.year}
                        onChange={handleChange}
                      />
                    </div>
                    {/* Manufacturers */}
                    <div className="col-md-6 col-lg-6">
                      <label className="no-required">Manufacturers</label>
                      <input
                        type="text"
                        name="manufacturers"
                        className="form-control"
                        placeholder="Type Manufacturers Company"
                        value={formValues.manufacturers}
                        onChange={handleChange}
                      />
                    </div>
                    {/* Structural Engineering */}
                    <div className="col-md-6 col-lg-6">
                      <label className="no-required">Structural Engineering</label>
                      <input
                        type="text"
                        name="structuralEngineering"
                        className="form-control"
                        placeholder="Type Engineering Name"
                        value={formValues.structuralEngineering}
                        onChange={handleChange}
                      />
                    </div>
                    {/* Civil Engineering */}
                    <div className="col-md-6 col-lg-6">
                      <label className="no-required">Civil Engineering</label>
                      <input
                        type="text"
                        name="civilEngineering"
                        className="form-control"
                        placeholder="Type Civil Engineering Name"
                        value={formValues.civilEngineering}
                        onChange={handleChange}
                      />
                    </div>
                    {/* Products used in this Project */}
                    <div className="col-lg-12">
                      <div className="d-flex justify-content-sm-between flex-column flex-sm-row align-items-sm-center mb-1">
                        <label className="no-required">
                          Products used in this Project
                        </label>
                        <p className="text-gray">Max 230 Word</p>
                      </div>
                      <textarea
                        name="details"
                        className="form-control"
                        rows={4}
                        placeholder="Write Details"
                        value={formValues.details}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Upload Project Image */}
                    <div className="col-lg-12">
                      <div>
                        <label>Upload Image</label>
                      </div>
                      <UploadFiles
                        callback={handleUploadImage}
                        acceptedFiles="jpg, png only"
                      />
                    </div>
                    
                    <div className="col-12 col-md-3 col-lg-3 col-xl-2 form-button-group">
                      <button type="submit" className="btn btn-secondary rounded-2 w-100">
                        Add Project
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
  
      {/* Render any children (e.g., completed projects listing) */}
      <section className="py-lg-5 py-4">
        {children}
      </section>
    </Fragment>
  );
};

export default ProjectsLayout;

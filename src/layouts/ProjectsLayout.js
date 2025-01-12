import Icons from "@/components/Icons";
import PageHeading from "@/components/PageHeading";
import UploadFiles from "@/components/UploadFile";
import { Fragment } from "react";
const ProjectsLayout = ({ children }) => {
  return (
    <Fragment>
      <section className="py-lg-5 py-4 auth-page">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <PageHeading title={"Projects"} description={"Choose from 254195+ Free & Premium CAD Files with new additions published every second month"} />
            </div>
          </div>

          <div className="row align-items-center">
            <div className="col-md-12">
              <div>
                <form>
                  <div className="form-wrapper rounded-xxl p-3 p-md-5 mb-md-5 mb-4">
                    <div className="row g-3">
                      {/* Personal Information */}
                      <div className="col-lg-12">
                        <div className="mt-3">
                          <h5 className="text-primary">Add <span className="fw-bold">Project</span></h5>
                        </div>
                      </div>
                      {/* Title */}
                      <div className="col-md-6 col-lg-6">
                        <div>
                          <label>Title  </label>
                        </div>
                        <input type="text" className="form-control" placeholder="Enter Your Title" value="" />
                      </div>
                      {/* Role */}
                      <div className="col-md-6 col-lg-6">
                        <div>
                          <label>Role</label>
                        </div>
                        <select className="form-select" aria-label="Role">
                          <option value="0">Select Role</option>
                          <option value="1">Architect</option>
                          <option value="2">Architect</option>
                          <option value="3">Architect</option>
                        </select>
                      </div>
                      {/* Location */}
                      <div className="col-md-6 col-lg-6">
                        <div>
                          <label>Location</label>
                        </div>
                        <input type="text" className="form-control" placeholder="Type Location" value="" />
                      </div>
                      {/* Keywords */}
                      <div className="col-md-6 col-lg-6">
                        <div>
                          <label>Keywords</label>
                        </div>
                        <input type="text" className="form-control" placeholder="Type Keywords" value="" />
                      </div>
                      {/* Project Type */}
                      <div className="col-md-6 col-lg-6">
                        <div>
                          <label>Project Type</label>
                        </div>
                        <select className="form-select" aria-label="Project Type">
                          <option value="0">Select Role</option>
                          <option value="1">My project - I own or built this</option>
                          <option value="2">My project - I own or built this</option>
                          <option value="3">My project - I own or built this</option>
                        </select>
                      </div>
                      {/* Designer  */}
                      <div className="col-md-6 col-lg-6">
                        <div>
                          <label className="no-required">Designer</label>
                        </div>
                        <input type="email" className="form-control" placeholder="Enter Your Designer" value="" />
                      </div>
                      {/* Year */}
                      <div className="col-md-6 col-lg-6">
                        <div>
                          <label className="no-required">Year</label>
                        </div>
                        <input type="date" className="form-control" placeholder="Enter Year" value="" />
                      </div>
                      {/* Manufacturers  */}
                      <div className="col-md-6 col-lg-6">
                        <div>
                          <label className="no-required">Manufacturers</label>
                        </div>
                        <input type="email" className="form-control" placeholder="Type Manufacturers Company" value="" />
                      </div>
                      {/* Structural Engineering  */}
                      <div className="col-md-6 col-lg-6">
                        <div>
                          <label className="no-required">Structural Engineering</label>
                        </div>
                        <input type="email" className="form-control" placeholder="Type Engineering Name" value="" />
                      </div>
                      {/* Civil Engineering  */}
                      <div className="col-md-6 col-lg-6">
                        <div>
                          <label className="no-required">Civil Engineering</label>
                        </div>
                        <input type="email" className="form-control" placeholder="Type Civil Engineering Name" value="" />
                      </div>
                      {/* Products used in this Project */}
                      <div className="col-lg-12">
                        <div className="d-flex justify-content-sm-between flex-column flex-sm-row align-items-sm-center mb-1">
                          <div>
                            <label className="no-required">Products used in this Project</label>
                          </div>
                          <p className="text-gray">Max 230 Word</p></div>
                        <textarea className="form-control" rows={4} placeholder="Write Detials">Write Detials</textarea>
                      </div>
                      {/* Upload File  */}
                      <div className="col-lg-12">
                        <div>
                          <label>Upload File</label>
                        </div>
                        <UploadFiles />
                      </div>
                      <div className="col-12 col-md-3 col-lg-3 col-xl-2 form-button-group">
                        <div className="mt-2 mt-md-3">
                          <button type="submit" className="btn btn-secondary rounded-2 w-100">Add Project</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div >
        </div >
      </section >

      {/* Completed Projects  */}
      < section section className="py-lg-5 py-4" >
        {children}
      </section >
    </Fragment >
  );
}

export default ProjectsLayout;
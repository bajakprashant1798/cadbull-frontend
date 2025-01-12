import Icons from './Icons'
import or from "@/assets/images/or.svg"

function ConsultModal() {
  return (
    <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content p-md-4 border-0 rounded-4">
          <div className="modal-body position-relative">
            <div classNameName='position-absolute end-0 me-3'>
              <button type="button" className="btn p-0 border-0 shadow-none" data-bs-dismiss="modal" aria-label="Close">
                <Icons.Close />
              </button>
            </div>
            <form>
              <div>
                <div className="row g-3">
                  {/* Personal Information */}
                  <div className="col-lg-12">
                    <div className="mt-3">
                      <h5 className="text-primary fw-medium">Get In <span className="fw-bold">Touch</span></h5>
                    </div>
                  </div>
                  {/* First Name */}
                  <div className="col-lg-6">
                    <div className="d-flex gap-2 align-items-center mb-1">
                      <Icons.User />
                      <label>First Name</label>
                    </div>
                    <input type="text" className="form-control" placeholder="Enter Your First Name" value="Zaha Hadid" />
                  </div>
                  {/* Last Name */}
                  <div className="col-lg-6">
                    <div className="d-flex gap-2 align-items-center mb-1">
                      <Icons.User />
                      <label>Last Name</label>
                    </div>
                    <input type="text" className="form-control" placeholder="Enter Your Last Name" value="LLP" />
                  </div>
                  {/* Email  */}
                  <div className="col-lg-6">
                    <div className="d-flex gap-2 align-items-center mb-1">
                      <Icons.Email />
                      <label>Email Address</label>
                    </div>
                    <input type="email" className="form-control" placeholder="Enter Your Email Address" value="technical.elenationllp@gmail.com" />
                  </div>
                  {/* Tags */}
                  <div className="col-lg-6">
                    <div className="d-flex gap-2 align-items-center mb-1">
                      <Icons.Tag />
                      <label className='no-required'>Tags</label>
                    </div>
                    <div className="btn-group gap-2 radio-tags" role="group" aria-label="radio toggle button group">
                      <input type="radio" className="btn-check" name="btnradio" id="btnradio1" value="Investor" autocomplete="off" />
                      <p className="btn btn-radio-primary rounded-1" for="btnradio1">Investor</p>

                      <input type="radio" className="btn-check" name="btnradio" id="btnradio2" value="Architect" autocomplete="off" />
                      <p className="btn btn-radio-primary rounded-1" for="btnradio2">Architect</p>

                      <input type="radio" className="btn-check" name="btnradio" id="btnradio3" value="Consultant" checked autocomplete="off" />
                      <p className="btn btn-radio-primary rounded-1" for="btnradio3">Consultant</p>

                      <input type="radio" className="btn-check" name="btnradio" id="btnradio4" value="Other" autocomplete="off" />
                      <p className="btn btn-radio-primary rounded-1" for="btnradio4">Other</p>
                    </div>
                  </div>
                  {/* Summary */}
                  < div className="col-lg-12" >
                    <div className="d-flex gap-2 align-items-center mb-1">
                      <Icons.Edit />
                      <label>Summary</label>
                    </div>
                    <textarea className="form-control" placeholder="Write Summary" ></textarea >
                  </div >
                  <div className="col-md-12 form-button-group">
                    <div className="mt-2 mt-md-3">
                      <button type="submit" className="btn btn-secondary rounded-2 w-100">Send Message</button>
                    </div>
                  </div>
                </div >
              </div >
            </form >
            <div className='my-4'>
              <img src={or.src} className='img-fluid w-100' alt="divider" />
            </div>
            <div className='text-center'>
              <a href="http://www.zaha-hadid.com/" className='text-primary fw-medium d-inline-flex align-items-center gap-2'>
                <Icons.Map/>
                <span>http://www.zaha-hadid.com/</span>
                </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConsultModal
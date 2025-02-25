import secure from "@/assets/icons/secure.svg";
import Link from "next/link";

const GetOff = () => {
  return (
    <section className='py-3 py-md-4'>
      <div className="container">
        <div className="row mx-2 get-off-wrapper rounded-xl align-items-center">
          <div className="col-lg-7 ps-0">
            <div className='get-off-text d-flex gap-lg-5 align-items-center flex-column flex-lg-row p-lg-4 p-4 py-5 ps-lg-5'>
              <div className="text-center text-lg-start">
                <h1 className='text-white fw-bolder mb-2 fs-1'>Get 20% Off</h1>
                <h5 className='text-white mb-3'>ON ANNUAL PLAN</h5>
              </div>
              <Link href='/pricing'>
                <button className='btn btn-light'>BUY NOW</button>
              </Link>
            </div>
          </div>
          <div className="col-lg-5">
            <div className='py-4 px-lg-4'>
              <form className='mx-auto mb-2'>
                <div className="input-group">
                  <input type="text" className="form-control  border-end-0 rounded-end-0" placeholder="Get latest update, Share your email" aria-label="Get latest update, Share your email" />
                  <span className="input-group-text p-0" id="inputGroup-sizing-lg">
                    <button type='submit' className='btn btn-lg btn-secondary rounded-start-0'>SUBSCRIBE</button>
                  </span>
                </div>
              </form>
              <p className='mt-3 mt-md-0 d-flex gap-1 align-items-center text-black'> <img src={secure.src} className='img-fluid' alt="icon" /> <span className="fw-medium">100% Secure. Zero Spam</span></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default GetOff
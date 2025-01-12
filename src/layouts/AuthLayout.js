import formImage from "@/assets/images/register.jpg"
import PageHeading from "@/components/PageHeading";
const AuthLayout = ({ title, description, children }) => {
  return (
    <section className="py-lg-5 py-4 auth-page">
      <div className="container">
        <div className="row mb-4">
          <div className="col-md-12">
            <PageHeading title={title} description={description} />
          </div>
        </div>

        <div className="row gy-3 gx-0 form-wrapper rounded-xxl align-items-center">
          <div className="col-md-6">
            <div className="p-md-4 px-2 py-0">
              <div className="mb-3 mb-md-4">
                <h4 className="mb-1">Welcome in <span>Cadbull</span> platform</h4>
                <p>Welcome back! Please enter your details.</p>
              </div>
              {children}
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-wrapper-image mt-3 mt-md-0">
              <img src={formImage.src} alt="form Image" className="img-fluid w-100 rounded-xxl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AuthLayout;
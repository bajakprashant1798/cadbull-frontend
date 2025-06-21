import logo from "@/assets/images/logo-footer.png";
import map from "@/assets/icons/map.png";
import phone from "@/assets/icons/phone.png";
import email from "@/assets/icons/email.png";
import arrow from "@/assets/icons/arrow.png";
import fb from "@/assets/icons/fb.png";
import twitter from "@/assets/icons/twitter.png";
import youtube from "@/assets/icons/youtube.png";
import Link from "next/link";
const Footer = () => {
  return ( 
    <footer className="mt-auto pt-4 pt-sm-5">
      <hr className="border-top-footer opacity-100 d-none d-lg-block" />
      <div className="container">
        <div className="footer-upper-wrapper">
          <div className="row d-lg-block d-none">
            <div className="col-md-12">
              <div className="logo-wrapper text-center">
                <img src={logo.src} alt="logo" className="img-fluid logo" />
              </div>
            </div>
          </div>
          <div className="row mt-md-4 gy-4">
            <div className="col-md-6 col-lg-5 col-xl-5">
             
                <h4 className="text-white mb-4">Get In Touch</h4>
                <ul className="list-unstyled d-flex gap-2 gap-md-4 flex-column">
                  <li>
                    <div className="d-flex align-items-start gap-2">
                      <img src={map.src} alt="icon" />
                      <p className="text-white">403, Fortune Business Hub, Beside science city, Science City Road Sola, Ahmedabad, Gujarat 380060</p>
                    </div>
                  </li>
                  <li className="d-flex align-items-start gap-3 flex-column flex-xl-row">
                    <div className="d-flex align-items-center gap-2">
                      <img src={phone.src} alt="icon" />
                      <p className="text-white">+91 989 874 8697</p>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <img src={email.src} alt="icon" />
                      <p className="text-white">support@cadbull.com</p>
                    </div>
                  </li>
                </ul>
            
            </div>
            <div className="col-md-6 col-lg-4 col-xl-3 ">
              <div className="text-start text-md-center">
                <img src={logo.src} alt="logo" className="img-fluid mb-3 d-block d-lg-none mx-md-auto logo" />
                <h4 className="text-white mb-md-4 d-none d-lg-block opacity-0">info</h4>
                <p className="text-white mb-3 mb-md-4">Cadbull is an exclusive forum that connects the creative community of innovative Auto cad designers, firms and organizations.</p>
                <ul className="list-unstyled d-flex gap-2 justify-content-md-center">
                  <li>
                    <a href="https://www.facebook.com/cadbull/" target="_blank"> <img src={fb.src} alt="icon" /></a>
                  </li>
                  <li>
                    <a href="https://twitter.com/cadbull" target="_blank"> <img src={twitter.src} alt="icon" /></a>
                  </li>
                  <li>
                    <a href="https://www.youtube.com/channel/UCy5GarRRRiH5he-WQ5JS5gQ" target="_blank"> <img src={youtube.src} alt="icon" /></a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md-12 col-lg-3 col-xl-4">
              <div>
                <h4 className="text-white mb-4">Quick Links</h4>
                <div className="d-flex  gap-5 justify-content-lg-around flex-lg-column gap-lg-2 gap-xl-5 flex-xl-row">
                  <ul className="list-unstyled d-flex flex-column gap-3 justify-content-center mb-0">
                    <li>
                      <Link href="/categories/sub/3d-Drawings"> <img src={arrow.src} alt="icon" /> <span>3d Drawing</span></Link>
                    </li>
                    <li>
                      <Link href="/categories/sub/Cad-Architecture">
                        <img src={arrow.src} alt="icon" />
                        <span>CAD Architecture</span></Link>
                    </li>
                    <li>
                      <Link href="/categories/sub/Cad-Landscaping">
                        <img src={arrow.src} alt="icon" />
                        <span>CAD Landscape</span></Link>
                    </li>
                    <li>
                      <Link href="/categories/sub/Autocad-Machinery-Blocks-&-DWG-Models">
                        <img src={arrow.src} alt="icon" />
                        <span>CAD Machinery</span></Link>
                    </li>
                  </ul>
                  <ul className="list-unstyled flex-column d-flex gap-2 justify-content-center mb-0">
                    <li>
                      <Link href="/categories/sub/Detail"> <img src={arrow.src} alt="icon" /> <span> CAD Detail</span></Link>
                    </li>
                    <li>
                      <Link href="/categories/sub/DWG-Blocks">
                        <img src={arrow.src} alt="icon" />
                        <span>DWG Blocks</span></Link>
                    </li>
                    <li>
                      <Link href="/categories/sub/Electrical-Cad">
                        <img src={arrow.src} alt="icon" />
                        <span>Electrical CAD</span></Link>
                    </li>
                    <li>
                      <Link href="/categories/sub/Autocad-Furniture-Blocks--&-DWG-Models">
                        <img src={arrow.src} alt="icon" />
                        <span>Furniture Blocks</span></Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr className="border-top-footer opacity-100" />
      <div className="container">
        <div className="footer-lower-wrapper text-center">
          <div className="d-flex align-items-center gap-2 gap-md-3 flex-column-reverse flex-md-row pb-3 justify-content-md-center">
            <p className="text-white">&copy; 2022 <span className="text-danger">CADBULL</span> | All Rights Reserved.</p>
            <ul className="list-unstyled d-flex align-items-center gap-3 gap-md-4 mb-0 justify-content-center ">
              <li>
                <Link href="/terms-condition">Term & Conditions</Link>
              </li>
              <li className="text-white">|</li>
              <li>
                <Link href="/privacy-policy">Privacy Policy</Link>
              </li>
              <li className="text-white">|</li>
              <li>
                <Link href="/faqs">FAQs</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer >
  );
}

export default Footer;
import Link from "next/link";
import Icons from "../Icons";
import { assets } from "@/utils/assets";

// import logo from "@/assets/images/logo.png";
// import profile_dummy from "@/assets/icons/profile.png";
const logo = assets.image("logo.png");
const profile_dummy = assets.icons("profile.png");

import { useSelector } from "react-redux";
import { loginSuccess, logout } from "../../../redux/app/features/authSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDollarSign,
  faFolder,
  faHeart,
  faPenToSquare,
  faSignOut,
  faUpload,
  faUser,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { getUserData, logoutApiHandler } from "@/service/api";
import { resetProjectState } from "../../../redux/app/features/projectsSlice";
import Image from "next/image";

const links = [
  {
    url: "/",
    title: "HOME",
    active: true,
  },
  {
    url: "/categories",
    title: "CATEGORIES",
    active: false,
  },
  {
    url: "/work/upload",
    title: "UPLOAD FILE",
    active: false,
  },
  {
    url: "/pricing",
    title: "PRICING",
    active: false,
  },
  {
    url: "/Architecture-House-Plan-CAD-Drawings",
    title: "HOUSE PLAN",
    active: false,
  },
  {
    url: "/about-us",
    title: "ABOUT US",
    active: false,
  },
  {
    url: "/contact-us",
    title: "CONTACT US",
    active: false,
  },
];

const Header = () => {
  const status = useSelector((store) => store.logininfo);
  const dispatch = useDispatch();
  const Router = useRouter();
  // ✅ State to force UI update after logout
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  // const token = useSelector((state) => state.logininfo.token); 

  // ✅ Production-grade auth check: Add a status to prevent FOUC
  const [authCheckStatus, setAuthCheckStatus] = useState("pending");
  
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const isAuthenticated = useSelector(
    (store) => store.logininfo.isAuthenticated
  );
  
  const [showHamburgerMenuItem, setShowHamburgerMenuItem] = useState(false);

  const handleLogout = async () => {
    // Prevent duplicate logout calls
    if (isLoggedOut) return;
    setIsLoggedOut(true);
    
    try {
      // Call the backend logout endpoint so cookies are cleared
      await logoutApiHandler();
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      // Clear client-side state and storage
      localStorage.removeItem("userData");

      dispatch(logout());
      dispatch(resetProjectState());
      Router.push("/auth/login");
      setIsLoggedOut(false);
    }
  };


  // Rehydrate Redux state by calling getUserData if not already authenticated.
  useEffect(() => {
    // This effect runs once on initial mount to check for an existing session.
    getUserData()
      .then((res) => {
        // If we get user data, it means they have a valid session cookie.
        if (res.data && res.data.user) {
          dispatch(loginSuccess({ user: res.data.user, status: "authenticated" }));
        }
      })
      .catch((err) => {
        // This is an expected and normal error for any visitor who is not logged in.
        // We can safely ignore it, as it simply means there's no active session.
      })
      .finally(() => {
        // ✅ No matter the outcome, the initial check is now complete.
        setAuthCheckStatus("done");
      });
  }, [dispatch]); // Run only once on component mount.  

  const closeHamburgerMenu = () => {
    setShowHamburgerMenuItem(false);
  };

  return (
    <header className="py-1">
      <div className="container">
        <nav className="navbar navbar-expand-xl">
          <div className="container-fluid">
            <Link href="/">
              <Image src={logo} width={150} height={36} alt="logo" className="logo"  priority  />
            </Link>
            <button
              className="navbar-toggler border-0 p-0 shadow-none"
              type="button"
              // data-bs-toggle="collapse"
              // data-bs-target="#navbarSupportedContent"
              // aria-controls="navbarSupportedContent"
              onClick={(e)=>{
                e.stopPropagation()
                setShowHamburgerMenuItem(!showHamburgerMenuItem)
              }}
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
             {!isAuthenticated &&  <Link
                href={"/auth/login"}
                onClick={(e)=>{
                  e.stopPropagation()
                }}
                className="btn btn-secondary d-inline-flex d-xl-none gap-1 align-items-center text-white me-2"
              >
                <Icons.User /> <span>LOGIN</span>
              </Link>}
              <span>
                <Icons.HamBurger />
              </span>
            </button>
            <div
              className={` collapse navbar-collapse ${showHamburgerMenuItem?"show":''} `}
              id="navbarSupportedContent"
            >

              {/* small screen device resposive */}
              {isAuthenticated && !isLoggedOut && (
                <>
                  <div className="dropdown-center dt-d-none mt-3 mt-xl-0">
                    <button
                      className="dropdown-toggle border-0 bg-transparent"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {status?.user?.profile_pic == null ? (
                        <Image src={profile_dummy} alt="profile" width={30} height={30}  />
                      ) : (
                        <Image
                          src={status?.user?.profile_pic || profile_dummy}
                          alt="profile"
                          width={30}
                          height={30}
                          style={{borderRadius:"50%"}}
                          onError={e => { e.target.onerror = null; e.target.src = profile_dummy }}
                        />
                      )} 
                    </button>
                    <ul className="dropdown-menu dropdown-menu-xl-end border-0 shadow-lg pt-1 mt-2">
                      <li>
                        <Link
                          // href="/profile"
                          href="/profile/edit"
                          className="dropdown-item d-flex gap-2 align-items-center"
                          onClick={closeHamburgerMenu}
                        >
                          {status?.user?.profile_pic == null ? (
                            <Image src={profile_dummy} alt="profile" width={30} height={30} />
                          ) : (
                            <Image
                              src={status?.user?.profile_pic || profile_dummy}
                              alt="profile"
                              width={30} height={30}
                              style={{borderRadius:"50%"}}
                              onError={e => { e.target.onerror = null; e.target.src = profile_dummy }}
                            />
                          )}
                          <div>
                            <p className="lh-sm text-black fw-bold h6 mb-0">
                              <small>
                                {status?.user?.firstname || status.user?.id} {status?.user?.lastname}
                              </small>
                            </p>
                            <p className="lh-sm">
                              <small>{status?.user?.email || "email"} </small>
                            </p>
                          </div>
                        </Link>
                      </li>
                      <li className="dropdown-divider my-1"></li>
                     
                      {/* Show Dashboard Link ONLY if the user is an Admin (role: 1) or Content Creator (role: 5) */}
                      {isClient && status?.user?.role === 1 || status?.user?.role === 5 || status?.user?.role === 6 ? (
                        
                        <li>
                          <Link
                            href={status?.user?.role === 1 ? "/admin/dashboard" : "/admin/dashboard"}
                            onClick={closeHamburgerMenu}
                            className="dropdown-item bg-transparent text-black"
                          >
                            <FontAwesomeIcon
                              icon={faUser}
                              className="fas fa-check"
                              style={{ color: "gray", marginRight: ".4rem" }}
                            ></FontAwesomeIcon>
                            <small>Dashboard</small>
                          </Link>
                        </li>
                      ) : null}

                      <li>
                        <Link
                          href={`/profile/author/${status?.user?.id}`}
                          onClick={closeHamburgerMenu}
                          className="dropdown-item bg-transparent text-black"
                        >
                          <FontAwesomeIcon
                            icon={faUser}
                            className="fas fa-check"
                            style={{ color: "gray", marginRight: ".4rem" }}
                          ></FontAwesomeIcon>
                          <small>My Profile</small>
                        </Link>
                      </li>

                      {/* <li>
                        <Link
                          href="/profile"
                          onClick={closeHamburgerMenu}
                          className="dropdown-item bg-transparent text-black"
                        >
                          <FontAwesomeIcon
                            icon={faUser}
                            className="fas fa-check"
                            style={{ color: "gray", marginRight: ".4rem" }}
                          ></FontAwesomeIcon>
                          <small>Create Architect Profile</small>
                        </Link>
                      </li> */}

                      <li>
                        <Link
                          href="/profile/edit"
                          onClick={closeHamburgerMenu}
                          className="dropdown-item bg-transparent text-black"
                        >
                          <FontAwesomeIcon
                            icon={faPenToSquare}
                            className="fas fa-check"
                            style={{ color: "gray", marginRight: ".4rem" }}
                          ></FontAwesomeIcon>
                          <small>Edit Profile</small>
                        </Link>
                      </li>
                      
                      <li>
                        <Link
                          href="/profile/billing"
                          onClick={closeHamburgerMenu}
                          className="dropdown-item bg-transparent text-black"
                        >
                          <FontAwesomeIcon
                            icon={faDollarSign}
                            className="fas fa-check"
                            style={{ color: "gray", marginRight: ".4rem" }}
                          ></FontAwesomeIcon>
                          <small>Manage Billing</small>
                        </Link>
                      </li>
                      
                      <li>
                        <Link
                          href="/favourites"
                          onClick={closeHamburgerMenu}
                          className="dropdown-item bg-transparent text-black"
                        >
                          <FontAwesomeIcon
                            icon={faHeart}
                            className="fas fa-check"
                            style={{ color: "gray", marginRight: ".4rem" }}
                          ></FontAwesomeIcon>
                          <small>Favourites</small>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/project"
                          onClick={closeHamburgerMenu}
                          className="dropdown-item bg-transparent text-black"
                        >
                          <FontAwesomeIcon
                            icon={faFolder}
                            style={{ color: "gray", marginRight: ".4rem" }}
                          ></FontAwesomeIcon>
                          <small>My Projects</small>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/experiences"
                          onClick={closeHamburgerMenu}
                          className="dropdown-item bg-transparent text-black"
                        >
                          <FontAwesomeIcon
                            icon={faFolder}
                            style={{ color: "gray", marginRight: ".4rem" }}
                          ></FontAwesomeIcon>
                          <small>Experiences</small>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/work/sent"
                          onClick={closeHamburgerMenu}
                          className="dropdown-item bg-transparent text-black"
                        >
                          <FontAwesomeIcon
                            icon={faFolder}
                            style={{ color: "gray", marginRight: ".4rem" }}
                          ></FontAwesomeIcon>
                          <small>Sent Work</small>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/work/upload"
                          onClick={closeHamburgerMenu}
                          className="dropdown-item bg-transparent text-black"
                        >
                          <FontAwesomeIcon
                            icon={faUpload}
                            className="fas fa-check"
                            style={{ color: "gray", marginRight: ".4rem" }}
                          ></FontAwesomeIcon>
                          <small>Upload Files</small>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/withdraw-amount"
                          onClick={closeHamburgerMenu}
                          className="dropdown-item bg-transparent text-black"
                        >
                          <FontAwesomeIcon
                            icon={faWallet}
                            className="fas fa-check"
                            style={{ color: "gray", marginRight: ".4rem" }}
                          ></FontAwesomeIcon>
                          <small>My Wallet</small>
                        </Link>
                      </li>
                      {/* <li><Link href="/contact" className="dropdown-item bg-transparent text-black"><small>Contact Us</small></Link></li> */}
                      <li className="dropdown-divider my-1"></li>
                      <li>
                        <button
                          onClick={() =>{ 
                            handleLogout()
                           closeHamburgerMenu()}}
                          className="dropdown-item bg-transparent text-black"
                        >
                          <FontAwesomeIcon
                            icon={faSignOut}
                            className="ml-1"
                            style={{ color: "red", marginRight: ".4rem" }}
                          ></FontAwesomeIcon>

                          <small>Logout</small>
                        </button>
                      </li>
                    </ul>
                  </div>
                </>
              ) }
              {/* small screen device responsive */}

              <ul className="navbar-nav mt-3 mt-xl-0 me-auto mb-2 mb-lg-0 mx-auto d-flex gap-lg-4 gap-3">
                {links.map((link, index) => {
                  return (
                    <li className="b-bottom-md" key={index}>
                      <Link
                       onClick={()=>{
                        closeHamburgerMenu();
                        //  if(link.url==='/categories'){
                        //   dispatch(addNewBreadCrumbPath({path:'Categories',url:link.url}))
                        //  }
                       }}
                        className={`${
                          link.url === Router.asPath ? "active" : ""
                        } nav-link`}
                        aria-current="page"
                        href={link.url}
                      >
                        {link.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {/* desktop device responsive */}
              {/* ✅ Only show auth state AFTER the initial check is done */}
              {authCheckStatus === "done" && (isAuthenticated && !isLoggedOut ? (
                <>
                  <div className="dropdown-center mb-d-none mt-3 mt-xl-0">
                    <button
                      className="dropdown-toggle border-0 bg-transparent"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {status?.user?.profile_pic == null ? (
                        <Image src={profile_dummy} alt="profile" width={30} height={30} />
                      ) : (
                        <Image
                          src={status?.user?.profile_pic || profile_dummy}
                          alt="profile"
                          width={30}
                          height={30}
                          style={{borderRadius:"50%"}}
                          onError={e => { e.target.onerror = null; e.target.src = profile_dummy }}
                        />
                      )} 
                    </button>
                    <ul className="dropdown-menu dropdown-menu-xl-end border-0 shadow-lg pt-1 mt-2">
                      <li>
                        <Link
                          // href="/profile"
                          href="/profile/edit"
                          className="dropdown-item d-flex gap-2 align-items-center"
                          onClick={closeHamburgerMenu}
                        >
                          {status?.user?.profile_pic == null ? (
                            <Image src={profile_dummy} alt="profile" width={30} height={30} />
                          ) : (
                            <Image
                              src={status?.user?.profile_pic || profile_dummy}
                              alt="profile"
                              width={30}
                              height={30}
                              style={{borderRadius:"50%"}}
                              onError={e => { e.target.onerror = null; e.target.src = profile_dummy }}
                            />
                          )}
                          <div>
                            <p className="lh-sm text-black fw-bold h6 mb-0">
                              <small>
                                {status?.user?.firstname || status.user?.id} {status?.user?.lastname}
                              </small>
                            </p>
                            <p className="lh-sm">
                              <small>{status?.user?.email || "email"}</small>
                            </p>
                          </div>
                        </Link>
                      </li>
                      <li className="dropdown-divider my-1"></li>
                     
                      {/* Show Dashboard Link ONLY if the user is an Admin (role: 1) or Content Creator (role: 5) */}
                      {isClient && (status?.user?.role === 1 || status?.user?.role === 5 || status?.user?.role === 6) ? (
                        
                        <li>
                          <Link
                            href={status?.user?.role === 1 ? "/admin/dashboard" : "/admin/dashboard"}
                            onClick={closeHamburgerMenu}
                            className="dropdown-item bg-transparent text-black"
                          >
                            <FontAwesomeIcon
                              icon={faUser}
                              className="fas fa-check"
                              style={{ color: "gray", marginRight: ".4rem" }}
                            ></FontAwesomeIcon>
                            <small>Dashboard</small>
                          </Link>
                        </li>
                      ) : null}

                      <li>
                        <Link
                          href={`/profile/author/${status?.user?.id}`}
                          onClick={closeHamburgerMenu}
                          className="dropdown-item bg-transparent text-black"
                        >
                          <FontAwesomeIcon
                            icon={faUser}
                            className="fas fa-check"
                            style={{ color: "gray", marginRight: ".4rem" }}
                          ></FontAwesomeIcon>
                          <small>My Profile</small>
                        </Link>
                      </li>

                      {/* <li>
                        <Link
                          href="/profile"
                          onClick={closeHamburgerMenu}
                          className="dropdown-item bg-transparent text-black"
                        >
                          <FontAwesomeIcon
                            icon={faUser}
                            className="fas fa-check"
                            style={{ color: "gray", marginRight: ".4rem" }}
                          ></FontAwesomeIcon>
                          <small>Create Architect Profile</small>
                        </Link>
                      </li> */}

                      <li>
                        <Link
                          href="/profile/edit"
                          onClick={closeHamburgerMenu}
                          className="dropdown-item bg-transparent text-black"
                        >
                          <FontAwesomeIcon
                            icon={faPenToSquare}
                            className="fas fa-check"
                            style={{ color: "gray", marginRight: ".4rem" }}
                          ></FontAwesomeIcon>
                          <small>Edit Profile</small>
                        </Link>
                      </li>
                      
                      <li>
                        <Link
                          href="/profile/billing"
                          onClick={closeHamburgerMenu}
                          className="dropdown-item bg-transparent text-black"
                        >
                          <FontAwesomeIcon
                            icon={faDollarSign}
                            className="fas fa-check"
                            style={{ color: "gray", marginRight: ".4rem" }}
                          ></FontAwesomeIcon>
                          <small>Manage Billing</small>
                        </Link>
                      </li>
                      
                      <li>
                        <Link
                          href="/favourites"
                          onClick={closeHamburgerMenu}
                          className="dropdown-item bg-transparent text-black"
                        >
                          <FontAwesomeIcon
                            icon={faHeart}
                            className="fas fa-check"
                            style={{ color: "gray", marginRight: ".4rem" }}
                          ></FontAwesomeIcon>
                          <small>Favourites</small>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/project"
                          onClick={closeHamburgerMenu}
                          className="dropdown-item bg-transparent text-black"
                        >
                          <FontAwesomeIcon
                            icon={faFolder}
                            style={{ color: "gray", marginRight: ".4rem" }}
                          ></FontAwesomeIcon>
                          <small>My Projects</small>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/experiences"
                          onClick={closeHamburgerMenu}
                          className="dropdown-item bg-transparent text-black"
                        >
                          <FontAwesomeIcon
                            icon={faFolder}
                            style={{ color: "gray", marginRight: ".4rem" }}
                          ></FontAwesomeIcon>
                          <small>Experiences</small>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/work/sent"
                          onClick={closeHamburgerMenu}
                          className="dropdown-item bg-transparent text-black"
                        >
                          <FontAwesomeIcon
                            icon={faFolder}
                            style={{ color: "gray", marginRight: ".4rem" }}
                          ></FontAwesomeIcon>
                          <small>Sent Work</small>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/work/upload"
                          onClick={closeHamburgerMenu}
                          className="dropdown-item bg-transparent text-black"
                        >
                          <FontAwesomeIcon
                            icon={faUpload}
                            className="fas fa-check"
                            style={{ color: "gray", marginRight: ".4rem" }}
                          ></FontAwesomeIcon>
                          <small>Upload Files</small>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/withdraw-amount"
                          onClick={closeHamburgerMenu}
                          className="dropdown-item bg-transparent text-black"
                        >
                          <FontAwesomeIcon
                            icon={faWallet}
                            className="fas fa-check"
                            style={{ color: "gray", marginRight: ".4rem" }}
                          ></FontAwesomeIcon>
                          <small>My Wallet</small>
                        </Link>
                      </li>
                      {/* <li><Link href="/contact" className="dropdown-item bg-transparent text-black"><small>Contact Us</small></Link></li> */}
                      <li className="dropdown-divider my-1"></li>
                      <li>
                        <button
                          onClick={() =>{ 
                            handleLogout()
                           closeHamburgerMenu()}}
                          className="dropdown-item bg-transparent text-black"
                        >
                          <FontAwesomeIcon
                            icon={faSignOut}
                            className="ml-1"
                            style={{ color: "red", marginRight: ".4rem" }}
                          ></FontAwesomeIcon>

                          <small>Logout</small>
                        </button>
                      </li>
                    </ul>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href={"/auth/login"}
                    className="d-none btn btn-secondary d-xl-inline-flex gap-1 align-items-center"
                  >
                    <Icons.User /> <span>LOGIN</span>
                  </Link>
                </>
              ))}
              {/* desktop device responsive */}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;

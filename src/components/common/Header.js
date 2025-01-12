import Link from "next/link";
import Icons from "../Icons";
import logo from "@/assets/images/logo.png";
import profile from "@/assets/icons/profile.png";
import { signOut } from "next-auth/react";
import Google from "next-auth/providers/google";
import { useSelector } from "react-redux";
import { store } from "../../../redux/app/store";
import { loginSuccess, logout } from "../../../redux/app/features/authSlice";
import { useDispatch } from "react-redux";
import { Router, useRouter } from "next/router";
import heart from "@/assets/icons/heart.png";
import projects from "@/assets/icons/heart.png";
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
import { addNewBreadCrumbPath } from "../../../redux/app/features/breadCrumbSlice";

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
    url: "/house-plan",
    title: "HOUSE PLAN",
    active: false,
  },
  {
    url: "/about",
    title: "ABOUT US",
    active: false,
  },
  {
    url: "/contact",
    title: "CONTACT US",
    active: false,
  },
];

const Header = () => {
  const status = useSelector((store) => store.logininfo);
  // const token = useSelector((state) => state.logininfo.token); 

  const isAuthenticated = useSelector(
    (store) => store.logininfo.isAuthenticated
  );
  const [showHamburgerMenuItem, setShowHamburgerMenuItem] = useState(false);
  const dispatch = useDispatch();
  const Router = useRouter();
  const handleLogout = () => {
    Router.push("/");
    dispatch(logout());
    sessionStorage.removeItem("userData");
    sessionStorage.removeItem('token');
  };

  useEffect(() => {
    const storedUserData = sessionStorage.getItem("userData");
    // console.log("token: ", token);
    console.log("status: ", status);
    
    console.log("storedUserData: ", storedUserData);
    
    if (storedUserData) {
      const userData = JSON.parse(storedUserData);
      dispatch(loginSuccess({ user: userData.user, token: userData.token, status: true }));
    }
    
  }, []);

  const closeHamburgerMenu = () => {
    setShowHamburgerMenuItem(false);
  };

  return (
    <header className="py-1">
      <div className="container">
        <nav className="navbar navbar-expand-xl">
          <div className="container-fluid">
            <Link href="/">
              <img src={logo.src} alt="logo" className="logo"    />
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
                <Icons.User />
              </Link>}
              <span>
                <Icons.HamBurger />
              </span>
            </button>
            <div
              className={` collapse navbar-collapse ${showHamburgerMenuItem?"show":''} `}
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav mt-3 mt-xl-0 me-auto mb-2 mb-lg-0 mx-auto d-flex gap-lg-4 gap-3">
                {links.map((link, index) => {
                  return (
                    <li className="" key={index}>
                      <Link
                       onClick={()=>{
                        closeHamburgerMenu();
                        //  if(link.url==='/categories'){
                        //   dispatch(addNewBreadCrumbPath({path:'Categories',url:link.url}))
                        //  }
                       }}
                        className={`${
                          link.url === Router.asPath ? "active" : ""
                        }`}
                        aria-current="page"
                        href={link.url}
                      >
                        {link.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {isAuthenticated ? (
                <>
                  <div className="dropdown-center mt-3 mt-xl-0">
                    <button
                      className="dropdown-toggle border-0 bg-transparent"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {status?.user?.profile_pic == null ? (
                        <img src={profile.src} alt="profile" width={30}  />
                      ) : (
                        <img
                          src={status?.user?.profile_pic}
                          alt="profile"
                          width={30}
                          style={{borderRadius:"50%"}}
                        />
                      )} 
                    </button>
                    <ul className="dropdown-menu dropdown-menu-xl-end border-0 shadow-lg pt-1 mt-2">
                      <li>
                        <Link
                          href="/profile"
                          className="dropdown-item d-flex gap-2 align-items-center"
                          onClick={closeHamburgerMenu}
                        >
                          {status?.user?.profile_pic == null ? (
                            <img src={profile.src} alt="profile" width={30} />
                          ) : (
                            <img
                              src={status?.user?.profile_pic}
                              alt="profile"
                              width={30}
                              style={{borderRadius:"50%"}}
                            />
                          )}
                          <div>
                            <h6 className="lh-sm text-black fw-bold">
                              <small>
                                {status?.user?.firstname} {status?.user?.last_name}
                              </small>
                            </h6>
                            <p className="lh-sm">
                              <small>{status?.user?.email}</small>
                            </p>
                          </div>
                        </Link>
                      </li>
                      <li className="dropdown-divider my-1"></li>
                     
                      <li>
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
                          href="/my-projects"
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
                          href="/work/upload"
                          onClick={closeHamburgerMenu}
                          className="dropdown-item bg-transparent text-black"
                        >
                          <FontAwesomeIcon
                            icon={faUpload}
                            className="fas fa-check"
                            style={{ color: "gray", marginRight: ".4rem" }}
                          ></FontAwesomeIcon>
                          <small>Upload Works</small>
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
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;

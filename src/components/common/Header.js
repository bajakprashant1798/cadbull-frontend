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
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { getUserData, logoutApiHandler } from "@/service/api";
import { resetProjectState } from "../../../redux/app/features/projectsSlice";
import Image from "next/image";

const links = [
  { url: "/", title: "Home", active: true },
  { url: "/categories", title: "Categories", active: false },
  { url: "https://ai.cadbull.com", title: "AI Studio", active: false, isExternal: false, isNew: true },
  { url: "/work/upload", title: "Upload File", active: false },
  { url: "/pricing", title: "Pricing", active: false },
  { url: "/Architecture-House-Plan-CAD-Drawings", title: "House Plan", active: false },
  { url: "/blog", title: "Blog", active: false },
  { url: "/about-us", title: "About Us", active: false },
  { url: "/contact-us", title: "Contact Us", active: false },
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

  const initials = ((status?.user?.firstname?.[0] || "") + (status?.user?.lastname?.[0] || "")).toUpperCase() || "U";

  const renderProfileButton = () => (
    <button
      className="dropdown-toggle d-flex align-items-center gap-2 px-2 py-1 rounded-pill"
      type="button"
      data-bs-toggle="dropdown"
      aria-expanded="false"
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      }}
    >
      {status?.user?.profile_pic ? (
        <Image
          src={status.user.profile_pic}
          alt="profile"
          width={32}
          height={32}
          style={{ borderRadius: "50%", objectFit: 'cover' }}
          onError={e => { e.target.onerror = null; e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
        />
      ) : null}
      <div
        className="align-items-center justify-content-center fw-bold"
        style={{
          display: status?.user?.profile_pic ? 'none' : 'flex',
          width: '32px',
          height: '32px',
          backgroundColor: '#f3f4f6',
          color: '#4b5563',
          borderRadius: '50%',
          fontSize: '0.85rem'
        }}
      >
        {initials}
      </div>
      <span className="fw-medium text-dark pe-1 d-none d-sm-block" style={{ fontSize: '0.9rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: '120px' }}>
        {status?.user?.firstname || "User"} {status?.user?.lastname}
      </span>
    </button>
  );

  const renderDropdownMenu = () => (
    <ul className="dropdown-menu dropdown-menu-end border-0 shadow pt-2 pb-2 mt-2" style={{ borderRadius: '12px', minWidth: '220px' }}>
      <li>
        <div className="dropdown-item d-flex flex-column px-4 py-2" style={{ cursor: 'default', backgroundColor: 'transparent' }}>
          <p className="lh-sm text-dark fw-bold mb-0" style={{ fontSize: '0.95rem' }}>
            {status?.user?.firstname || status.user?.id} {status?.user?.lastname}
          </p>
          <p className="lh-sm text-secondary mb-0" style={{ fontSize: '0.85rem' }}>
            {status?.user?.email || "email"}
          </p>
        </div>
      </li>
      <li className="dropdown-divider my-2 opacity-50"></li>

      <li>
        <a href="https://ai.cadbull.com" rel="noopener noreferrer" onClick={closeHamburgerMenu} className="dropdown-item d-flex align-items-center gap-3 px-4 py-2 text-dark bg-transparent">
          <FontAwesomeIcon icon={faWandMagicSparkles} className="text-secondary" style={{ width: '14px' }} />
          <span className="d-flex align-items-center gap-2" style={{ fontSize: '0.9rem', fontWeight: '500' }}>
            AI Studio
            <span className="badge bg-danger rounded-pill px-1" style={{ fontSize: '0.55rem', padding: '0.15em 0.3em' }}>NEW</span>
          </span>
        </a>
      </li>

      {isClient && [1, 5, 6, 7].includes(Number(status?.user?.role)) && (
        <li>
          <Link href="/admin/dashboard" onClick={closeHamburgerMenu} className="dropdown-item d-flex align-items-center gap-3 px-4 py-2 text-dark">
            <FontAwesomeIcon icon={faUser} className="text-secondary" style={{ width: '14px' }} />
            <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Dashboard</span>
          </Link>
        </li>
      )}

      <li>
        <Link href={`/profile/author/${status?.user?.id}`} onClick={closeHamburgerMenu} className="dropdown-item d-flex align-items-center gap-3 px-4 py-2 text-dark">
          <FontAwesomeIcon icon={faUser} className="text-secondary" style={{ width: '14px' }} />
          <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>My Profile</span>
        </Link>
      </li>

      <li>
        <Link href="/profile/edit" onClick={closeHamburgerMenu} className="dropdown-item d-flex align-items-center gap-3 px-4 py-2 text-dark">
          <FontAwesomeIcon icon={faPenToSquare} className="text-secondary" style={{ width: '14px' }} />
          <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Edit Profile</span>
        </Link>
      </li>

      <li>
        <Link href="/profile/billing" onClick={closeHamburgerMenu} className="dropdown-item d-flex align-items-center gap-3 px-4 py-2 text-dark">
          <FontAwesomeIcon icon={faDollarSign} className="text-secondary" style={{ width: '14px' }} />
          <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Manage Billing</span>
        </Link>
      </li>

      <li>
        <Link href="/favourites" onClick={closeHamburgerMenu} className="dropdown-item d-flex align-items-center gap-3 px-4 py-2 text-dark">
          <FontAwesomeIcon icon={faHeart} className="text-secondary" style={{ width: '14px' }} />
          <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Favourites</span>
        </Link>
      </li>

      <li>
        <Link href="/project" onClick={closeHamburgerMenu} className="dropdown-item d-flex align-items-center gap-3 px-4 py-2 text-dark">
          <FontAwesomeIcon icon={faFolder} className="text-secondary" style={{ width: '14px' }} />
          <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>My Projects</span>
        </Link>
      </li>

      <li>
        <Link href="/experiences" onClick={closeHamburgerMenu} className="dropdown-item d-flex align-items-center gap-3 px-4 py-2 text-dark">
          <FontAwesomeIcon icon={faFolder} className="text-secondary" style={{ width: '14px' }} />
          <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Experiences</span>
        </Link>
      </li>

      <li>
        <Link href="/work/sent" onClick={closeHamburgerMenu} className="dropdown-item d-flex align-items-center gap-3 px-4 py-2 text-dark">
          <FontAwesomeIcon icon={faFolder} className="text-secondary" style={{ width: '14px' }} />
          <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Sent Work</span>
        </Link>
      </li>

      <li>
        <Link href="/work/upload" onClick={closeHamburgerMenu} className="dropdown-item d-flex align-items-center gap-3 px-4 py-2 text-dark">
          <FontAwesomeIcon icon={faUpload} className="text-secondary" style={{ width: '14px' }} />
          <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Upload Files</span>
        </Link>
      </li>

      <li>
        <Link href="/withdraw-amount" onClick={closeHamburgerMenu} className="dropdown-item d-flex align-items-center gap-3 px-4 py-2 text-dark">
          <FontAwesomeIcon icon={faWallet} className="text-secondary" style={{ width: '14px' }} />
          <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>My Wallet</span>
        </Link>
      </li>

      <li className="dropdown-divider my-2 opacity-50"></li>

      <li>
        <button onClick={() => { handleLogout(); closeHamburgerMenu(); }} className="dropdown-item d-flex align-items-center gap-3 px-4 py-2 text-danger">
          <FontAwesomeIcon icon={faSignOut} className="text-danger" style={{ width: '14px' }} />
          <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Log out</span>
        </button>
      </li>
    </ul>
  );

  return (
    <>
      <header
        className="fixed-top"
        style={{
          padding: '0.75rem 0',
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(226, 232, 240, 0.6)',
          zIndex: 1040,
          transition: 'box-shadow 0.3s ease'
        }}
      >
        <style>{`
        body { padding-top: 72px; }
        .ai-nav-link {
          display: inline-flex;
          align-items: center;
          border-radius: 0.375rem;
          padding: 0.5rem 0.75rem !important;
          font-size: 0.875rem !important;
          font-weight: 500 !important;
          color: #64748b !important;
          transition: background-color 0.2s, color 0.2s;
          text-decoration: none;
        }
        .ai-nav-link:hover {
          background-color: #f1f5f9;
          color: #0f172a !important;
          border-radius: calc(0.625rem - 2px);
        }
        .ai-nav-link.active {
          background-color: rgba(241, 245, 249, 0.5);
          color: #0f172a !important;
          font-weight: 600 !important
          border-radius: calc(0.625rem - 2px);;
        }
      `}</style>
        <div className="container">
          <nav className="navbar navbar-expand-xl">
            <div className="container-fluid">
              <Link href="/" className="d-flex align-items-center text-decoration-none" style={{ gap: '10px' }}>
                <Image src="/logo.webp" width={34} height={34} alt="Cadbull Logo" priority />
                <span className="fw-bold text-dark m-0 d-none d-sm-block" style={{ fontSize: '1.4rem', letterSpacing: '-0.5px' }}>Cadbull</span>
              </Link>
              <div className="d-flex align-items-center d-xl-none gap-3">
                {authCheckStatus === "done" && (isAuthenticated && !isLoggedOut ? (
                  <div className="dropdown">
                    {renderProfileButton()}
                    {renderDropdownMenu()}
                  </div>
                ) : (
                  <Link
                    href={"/auth/login"}
                    className="btn btn-secondary d-inline-flex gap-1 align-items-center text-white btn-sm"
                    style={{ fontSize: '0.85rem' }}
                  >
                    <Icons.User /> <span>Login</span>
                  </Link>
                ))}
                <button
                  className="navbar-toggler border-0 p-0 shadow-none"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowHamburgerMenuItem(!showHamburgerMenuItem)
                  }}
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span>
                    <Icons.HamBurger />
                  </span>
                </button>
              </div>
              <div className="collapse navbar-collapse d-none d-xl-block" id="navbarSupportedContent">
                <ul className="navbar-nav mt-3 mt-xl-0 me-auto mb-2 mb-lg-0 mx-auto d-flex gap-lg-3 gap-xl-3 align-items-center">
                  {links.map((link, index) => {
                    const isExternalProxy = link.url.startsWith("/blog");
                    const content = (
                      <div className="d-flex align-items-center gap-1">
                        {link.title}
                        {link.isNew && (
                          <span className="badge bg-danger rounded-pill px-1" style={{ fontSize: '0.55rem', padding: '0.2em 0.4em', transform: 'translateY(-1px)' }}>
                            NEW
                          </span>
                        )}
                      </div>
                    );
                    return (
                      <li key={index}>
                        {link.isExternal || isExternalProxy ? (
                          <a
                            onClick={() => {
                              closeHamburgerMenu();
                            }}
                            className={`${link.url === Router.asPath ? "active" : ""} nav-link ai-nav-link`}
                            aria-current="page"
                            href={link.url}
                            target={link.isExternal ? "_blank" : "_self"}
                            rel={link.isExternal ? "noopener noreferrer" : ""}
                          >
                            {content}
                          </a>
                        ) : (
                          <Link
                            onClick={() => {
                              closeHamburgerMenu();
                            }}
                            className={`${link.url === Router.asPath ? "active" : ""} nav-link ai-nav-link`}
                            aria-current="page"
                            href={link.url}
                          >
                            {content}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>

                {/* desktop device responsive */}
                {authCheckStatus === "done" && (isAuthenticated && !isLoggedOut ? (
                  <div className="dropdown-center mb-d-none mt-3 mt-xl-0">
                    {renderProfileButton()}
                    {renderDropdownMenu()}
                  </div>
                ) : (
                  <Link
                    href={"/auth/login"}
                    className="d-none btn btn-secondary d-xl-inline-flex gap-1 align-items-center"
                  >
                    <Icons.User /> <span>Login</span>
                  </Link>
                ))}
              </div>

            </div>
          </nav>
        </div>
      </header>

      {/* Mobile menu drawer */}
      {showHamburgerMenuItem && (
        <div className="d-xl-none position-fixed top-0 start-0 w-100 h-100" style={{ zIndex: 999999 }}>
          {/* Backdrop */}
          <div
            className="position-absolute top-0 start-0 w-100 h-100 bg-dark"
            style={{ opacity: 0.5, transition: 'opacity 0.3s ease-in-out' }}
            onClick={() => setShowHamburgerMenuItem(false)}
          ></div>
          {/* Drawer */}
          <div
            className="position-absolute top-0 end-0 h-100 bg-white shadow-lg d-flex flex-column"
            style={{ width: '85%', maxWidth: '380px', transition: 'transform 0.3s ease-in-out', overflowY: 'auto' }}
          >
            <div className="d-flex align-items-center justify-content-between px-4 py-3 border-bottom">
              <div className="d-flex align-items-center gap-2">
                <Image src="/logo.webp" width={32} height={32} alt="Cadbull Logo" />
                <span className="fw-bold text-dark m-0" style={{ fontSize: '1.2rem', letterSpacing: '-0.5px' }}>Cadbull</span>
              </div>
              <button
                className="btn border-0 p-1 rounded hover-bg-light"
                onClick={() => setShowHamburgerMenuItem(false)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <div className="p-3 flex-grow-1 overflow-y-auto">
              <div className="px-2 pb-2" style={{ fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', color: '#64748b' }}>Explore</div>
              <div className="d-flex flex-column gap-1">
                {links.map((link, index) => {
                  const isExternalProxy = link.url.startsWith("/blog");
                  const content = (
                    <div className="d-flex align-items-center gap-2">
                      {link.title}
                      {link.isNew && (
                        <span className="badge bg-danger rounded-pill px-1" style={{ fontSize: '0.55rem', padding: '0.2em 0.4em', transform: 'translateY(-1px)' }}>
                          NEW
                        </span>
                      )}
                    </div>
                  );
                  return (
                    <div key={index}>
                      {link.isExternal || isExternalProxy ? (
                        <a
                          href={link.url}
                          target={link.isExternal ? "_blank" : "_self"}
                          rel={link.isExternal ? "noopener noreferrer" : ""}
                          className="d-flex align-items-center gap-2 px-3 py-3 rounded text-decoration-none ai-nav-link"
                          onClick={() => setShowHamburgerMenuItem(false)}
                          style={{ backgroundColor: Router.asPath === link.url ? '#f1f5f9' : 'transparent', fontWeight: '500', fontSize: '0.95rem' }}
                        >
                          {content}
                        </a>
                      ) : (
                        <Link
                          href={link.url}
                          className="d-flex align-items-center gap-2 px-3 py-3 rounded text-decoration-none ai-nav-link"
                          onClick={() => setShowHamburgerMenuItem(false)}
                          style={{ backgroundColor: Router.asPath === link.url ? '#f1f5f9' : 'transparent', fontWeight: '500', fontSize: '0.95rem' }}
                        >
                          {content}
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="p-4 border-top" style={{ backgroundColor: '#f8f9fa' }}>
              {authCheckStatus === "done" && (isAuthenticated && !isLoggedOut ? (
                <>
                  <Link href="/admin/dashboard" className="btn btn-light w-100 mb-2 shadow-sm fw-bold border" onClick={() => setShowHamburgerMenuItem(false)}>Go to Dashboard</Link>
                  <button className="btn btn-outline-secondary w-100 fw-bold" onClick={() => { handleLogout(); setShowHamburgerMenuItem(false); }}>Sign out</button>
                </>
              ) : (
                <>
                  <Link href="/auth/register" className="btn btn-primary w-100 mb-2 shadow-sm fw-bold border-0" onClick={() => setShowHamburgerMenuItem(false)}>Get started free</Link>
                  <Link href="/auth/login" className="btn btn-outline-secondary w-100 fw-bold" onClick={() => setShowHamburgerMenuItem(false)}>Sign in</Link>
                </>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;

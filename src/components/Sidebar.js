import { useState } from "react";
import Link from "next/link";
import { Briefcase, Users, Layers, Folder, Mail, Search, CreditCard, Settings, List, LogOut, ChevronDown, ChevronUp, PlusCircle, Edit } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/app/features/authSlice"
import { useRouter } from "next/router";

const Sidebar = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [projectMenuOpen, setProjectMenuOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [occupationMenuOpen, setOccupationMenuOpen] = useState(false);
  const [interestMenuOpen, setInterestMenuOpen] = useState(false);
  const [newsletterMenuOpen, setNewsletterMenuOpen] = useState(false);
  const [emailMenuOpen, setEmailMenuOpen] = useState(false);

  const user = useSelector((store) => store.logininfo.user); // Get user from Redux
  const userRole = user?.role; // Get the role of logged-in user

  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    dispatch(logout());
  
    // ✅ Clear session storage
    sessionStorage.removeItem("userData");
    sessionStorage.removeItem("token");
  
    // ✅ Ensure proper redirection with Next.js router
    router.replace("/auth/login");
  
    // ✅ Hard reload fallback if router.replace doesn't work
    setTimeout(() => {
      window.location.href = "/auth/login";
    }, 500);
  };
    

  return (
    <aside className="bg-dark text-white vh-100 p-3 sidebar">
      <h3 className="text-white">Admin Panel</h3>
      <ul className="nav flex-column">
        {/* Dashboard */}
        {/* <li className="nav-item">
          <Link href="/admin/dashboard" className="nav-link text-white">
            <Home size={18} className="me-2" /> Dashboard
          </Link>
        </li> */}

        {/* Content Creator (Role 5) should only see User Management */}
        {userRole === 5 ? (
          <>
            {/* Project Management with Dropdown */}
            <li className="nav-item">
                <button 
                    className="nav-link text-white d-flex justify-content-between align-items-center w-100"
                    onClick={() => setProjectMenuOpen(!projectMenuOpen)}
                >
                    <span className="me-2"><Layers size={18} className="me-2" /> Project Management</span>
                    {projectMenuOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {projectMenuOpen && (
                    <ul className="nav flex-column ms-3">
                    <li>
                        <Link href="/admin/users/add" className="nav-link text-white">
                            <span className="me-2"><PlusCircle size={18} className="me-2" />Add Project</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/admin/users/admins" className="nav-link text-white">
                            <span className="me-2"><List size={18} className="me-2" />View Project</span>
                        </Link>
                    </li>
                    </ul>
                )}
            </li>
          </>
        ) : (
          <>
        {/* Super Admin (Role 1) - Full Access */}

        {/* User Management with Dropdown */}
        <li className="nav-item">
          <button 
            className="nav-link text-white d-flex justify-content-between align-items-center w-100"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
          >
            <span className="me-2"><Users size={18} className="me-2" /> User Management</span>
            {userMenuOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          {userMenuOpen && (
            <ul className="nav flex-column ms-3">
              <li>
                <Link href="/admin/users/add" className="nav-link text-white">
                    <span className="me-2"><PlusCircle size={18} className="me-2" />Add User</span>
                </Link>
              </li>
              <li>
                <Link href="/admin/users/view-data-operators" className="nav-link text-white">
                    <span className="me-2"><List size={18} className="me-2" />View Data Operator</span>
                </Link>
              </li>
              <li>
                <Link href="/admin/users/view-admins" className="nav-link text-white">
                    <span className="me-2"><List size={18} className="me-2" />View Admins</span>
                </Link>
              </li>
              <li>
                <Link href="/admin/users/view-content-creators" className="nav-link text-white">
                    <span className="me-2"><List size={18} className="me-2" />View Content Creator</span>
                </Link>
              </li>
              <li>
                <Link href="/admin/users/view-users" className="nav-link text-white">
                    <span className="me-2"><List size={18} className="me-2" />View Users</span>
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* Category Management with Dropdown */}
        <li className="nav-item">
          <button 
            className="nav-link text-white d-flex justify-content-between align-items-center w-100"
            onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}
          >
            <span className="me-2">
                <Folder size={18} className="me-2" /> Category Management
            </span>
            {categoryMenuOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          {categoryMenuOpen && (
            <ul className="nav flex-column ms-3">
              <li>
                <Link href="/admin/categories/add-category" className="nav-link text-white">
                    <span className="me-2"><PlusCircle size={18} className="me-2" />Add Category</span>
                </Link>
              </li>
              <li>
                <Link href="/admin/categories/all-categories" className="nav-link text-white">
                    <span className="me-2"><List size={18} className="me-2" />All categories</span>
                </Link>
              </li>
              <li>
                <Link href="/admin/categories/active-categories" className="nav-link text-white">
                    <span className="me-2"><List size={18} className="me-2" />Active categories</span>
                </Link>
              </li>
              <li>
                <Link href="/admin/categories/inactive-categories" className="nav-link text-white">
                    <span className="me-2"><List size={18} className="me-2" />Inactive categories</span>
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* Projects Management with Dropdown */}
        <li className="nav-item">
          <button 
            className="nav-link text-white d-flex justify-content-between align-items-center w-100"
            onClick={() => setProjectMenuOpen(!projectMenuOpen)}
          >
            <span className="me-2"><Layers size={18} className="me-2" /> Project Management</span>
            {projectMenuOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          {projectMenuOpen && (
            <ul className="nav flex-column ms-3">
              <li>
                <Link href="/admin/projects/add-project" className="nav-link text-white">
                    <span className="me-2"><PlusCircle size={18} className="me-2" />Add Project</span>
                </Link>
              </li>
              <li>
                <Link href="/admin/projects/view-projects" className="nav-link text-white">
                    <span className="me-2"><List size={18} className="me-2" />View Project</span>
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* Occupation Management with Dropdown */}
        <li className="nav-item">
          <button 
            className="nav-link text-white d-flex justify-content-between align-items-center w-100"
            onClick={() => setOccupationMenuOpen(!occupationMenuOpen)}
          >
            <span className="me-2"><Briefcase size={18} className="me-2" /> Occupation Management</span>
            {occupationMenuOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          {occupationMenuOpen && (
            <ul className="nav flex-column ms-3">
              <li>
                <Link href="/admin/occupations/add-occupation" className="nav-link text-white">
                    <span className="me-2"><PlusCircle size={18} className="me-2" />Add Occupation</span>
                </Link>
              </li>
              <li>
                <Link href="/admin/occupations/list-of-occupations" className="nav-link text-white">
                    <span className="me-2"><List size={18} className="me-2" />List of Occupation</span>
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* Interest Management with Dropdown */}
        <li className="nav-item">
          <button 
            className="nav-link text-white d-flex justify-content-between align-items-center w-100"
            onClick={() => setInterestMenuOpen(!interestMenuOpen)}
          >
            <span className="me-2"><Folder size={18} className="me-2" /> interest Management</span>
            {interestMenuOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          {interestMenuOpen && (
            <ul className="nav flex-column ms-3">
              <li>
                <Link href="/admin/interests/add-interest" className="nav-link text-white">
                    <span className="me-2"><PlusCircle size={18} className="me-2" />Add Interest</span>
                </Link>
              </li>
              <li>
                <Link href="/admin/interests/list-of-interests" className="nav-link text-white">
                    <span className="me-2"><List size={18} className="me-2" />List of Interest</span>
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* Newsletter Management with Dropdown */}
        <li className="nav-item">
          <button 
            className="nav-link text-white d-flex justify-content-between align-items-center w-100"
            onClick={() => setNewsletterMenuOpen(!newsletterMenuOpen)}
          >
            <span className="me-2"><Mail size={18} className="me-2" /> Newsletter Management</span>
            {newsletterMenuOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          {newsletterMenuOpen && (
            <ul className="nav flex-column ms-3">
              <li>
                <Link href="/admin/newsletters/add-subscriber" className="nav-link text-white">
                    <span className="me-2"><PlusCircle size={18} className="me-2" />Add Subscriber</span>
                </Link>
              </li>
              <li>
                <Link href="/admin/newsletters/list-of-subscribers" className="nav-link text-white">
                <span className="me-2"><List size={18} className="me-2" />List of Subscriber</span>
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* Email Management with Dropdown */}
        <li className="nav-item">
          <button 
            className="nav-link text-white d-flex justify-content-between align-items-center w-100"
            onClick={() => setEmailMenuOpen(!emailMenuOpen)}
          >
            <span className="me-2"><Mail size={18} className="me-2" /> Email Management</span>
            {emailMenuOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          {emailMenuOpen && (
            <ul className="nav flex-column ms-3">
              <li>
                <Link href="/admin/newsletteremail" className="nav-link text-white">
                    <span className="me-2"><Edit size={18} className="me-2" />Update Email</span>
                </Link>
              </li>
              {/* <li>
                <Link href="/admin/users/admins" className="nav-link text-white">
                    <span className="me-2"><List size={18} className="me-2" />Send Email</span>
                </Link>
              </li> */}
            </ul>
          )}
        </li>

        {/* Search words with Dropdown */}
        <li className="nav-item">
            <Link href="/admin/search-words" className="nav-link text-white">
                <Search size={18} className="me-2" /> Search words
            </Link>
        </li>

        {/* Redeem Requests with Dropdown */}
        <li className="nav-item">
            <Link href="/admin/dashboard" className="nav-link text-white">
                <CreditCard size={18} className="me-2" /> Redeem Requests
            </Link>
        </li>

        {/* Users Earning with Dropdown */}
        <li className="nav-item">
            <Link href="/admin/dashboard" className="nav-link text-white">
                <CreditCard size={18} className="me-2" /> Users Earning
            </Link>
        </li>

        {/* Change Password with Dropdown */}
        <li className="nav-item">
            <Link href="/admin/change-password" className="nav-link text-white">
                <Settings size={18} className="me-2" /> Change Password
            </Link>
        </li>

        {/* Logout with Dropdown */}
        <li className="nav-item">
          <button className="nav-link text-danger" onClick={handleLogout}>Logout</button>
        </li>

        </>
        )}

      </ul>
    </aside>
  );
};

export default Sidebar;

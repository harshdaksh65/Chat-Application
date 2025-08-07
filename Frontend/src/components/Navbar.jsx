import { LogOut, MessageSquare, MessageSquareDashed, Settings, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../store/slices/authSlice";

const Navbar = () => {
  const { authUser } = useSelector((state) => state.auth);
  const { selectedUser } = useSelector((state) => state.chat);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  // Hide navbar on mobile when chat is open
  const shouldHideOnMobile = selectedUser !== null;
  return <>
    <header className={`fixed top-0 w-full z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm ${shouldHideOnMobile ? 'hidden lg:block' : 'block'}`}>
      <div className="max-w-7xl mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* // Logo or Brand Name */}
          <div className="flex items-center gap-8">
            <Link to={'/'} className="flex items-center gap-2.5 hover:opacity-80 transition"> 
            <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
              <MessageSquareDashed className="w-5 h-5 text-blue-600" />
            </div>
            <h1 className="text-lg font-bold text-gray-800">Talkie</h1>
            </Link>
          </div>

          {/* Right actions */}
          <div>
            {
              authUser && (
                <>
                  <Link to={`/profile/${authUser.id}`} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition">
                    <User className="w-5 h-5 text-blue-600" />
                    <span className="hidden sm:inline text-gray-800">{authUser.name}</span>
                  </Link>
                  
                </>
              )
            }
          </div>
        </div>
      </div>
    </header>
  </>;
};

export default Navbar;

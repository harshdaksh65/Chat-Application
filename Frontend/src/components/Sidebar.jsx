import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SidebarSkeleton from "../components/skeletons/SidebarSkeleton";
import { getUsers, setSelectedUser } from "../store/slices/chatSlice";
import { EllipsisVertical, LogOut, Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import { logout } from "../store/slices/authSlice";

const Sidebar = () => {
  const [ShowOnlineOnly, setShowOnlineOnly] = useState(false);
  const [isOpen, setisOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isClosing, setIsClosing] = useState(false);

  const { users, selectedUser, isUsersLoading } = useSelector(
    (state) => state.chat
  );

  const { onlineUsers } = useSelector((state) => state.auth);
  const { authUser } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const filteredUsers = users
    .filter((user) => user._id !== authUser._id)
    .filter((user) => {
      const matchesSearch = user.username
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesOnlineFilter = ShowOnlineOnly
        ? onlineUsers.includes(user._id)
        : true;
      return matchesSearch && matchesOnlineFilter;
    });

  if (isUsersLoading) return <SidebarSkeleton />;

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleUserSelect = (user) => {
    // Only animate on mobile (screen width < 1024px)
    if (window.innerWidth < 1024) {
      setIsClosing(true);
      setTimeout(() => {
        dispatch(setSelectedUser(user));
        setIsClosing(false);
      }, 500); // Match animation duration
    } else {
      // Desktop - no animation
      dispatch(setSelectedUser(user));
    }
  };

  return (
    <>
      <aside className={`h-full ${selectedUser ? 'mt-0' : 'mt-16'} md:mt-0 w-[100vw] lg:w-72 border-r border-gray-200 flex flex-col transition-all duration-300 bg-white relative z-30 ${isClosing ? 'animate-slideOutLeft' : ''}`}>
        {/* header */}
        <div className="hidden md:flex justify-between items-center p-4 lg:p-3 md:mt-0">
          <Link
            to={`/profile/${authUser.id}`}
            className="flex justify-start items-center flex-1">
            <div className="flex items-center justify-center lg:justify-start gap-2 transition-colors rounded-md">
              <img
                className="w-12 h-12 object-cover rounded-full"
                src={
                  authUser?.avatar?.url
                    ? authUser.avatar.url
                    : "/user-circle-svgrepo-com.svg"
                }
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/user-circle-svgrepo-com.svg";
                }}
                alt="User Avatar"
              />
            </div>
            <div className="block lg:block ml-3">
              <h1 className="font-semibold">{authUser.username}</h1>
              <h4 className="text-xs font-medium opacity-35">
                {authUser.email}
              </h4>
            </div>
          </Link>

          <div className="relative">
            <EllipsisVertical
              className="mr-2 cursor-pointer hover:bg-gray-100 rounded-full p-1"
              size={26}
              onClick={() => setisOpen(!isOpen)}
            />
            {isOpen && (
              <div className="flex flex-col absolute rounded-md shadow-xl px-2 py-1 top-8 right-0 z-50 bg-white border border-gray-200">
                <Link
                  to={`/profile/${authUser.id}`}
                  className="hover:bg-blue-100 px-3 py-1.5 rounded-md font-medium whitespace-nowrap"
                  onClick={() => setisOpen(false)}>
                  Profile
                </Link>
                <button onClick={handleLogout} className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-red-700 hover:bg-red-100 transition">
                    <LogOut className="w-5 h-5" />
                    <span className="">Logout</span>
                  </button>
              </div>
            )}
          </div>
        </div>

        <div className="border-b border-gray-200 w-full pt-5 pl-5 pr-5 pb-3 -mt-2">
          <div className="flex items-center gap-2">
            <span className="font-medium text-xl text-gray-800">
              All messages
            </span>
          </div>

          {/* Search bar */}
          <div className="mt-3 relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Toggle buttons for All Users / Online Users */}
          <div className="mt-3 flex justify-start items-center gap-2 rounded-lg ">
            <button
              onClick={() => setShowOnlineOnly(false)}
              className={`text-sm px-3 py-1 cursor-pointer font-medium rounded-full transition-colors ${
                !ShowOnlineOnly
                  ? "bg-blue-200 text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}>
              All Users
            </button>
            <button
              onClick={() => setShowOnlineOnly(true)}
              className={`text-sm px-3 py-1 cursor-pointer font-medium rounded-full transition-colors ${
                ShowOnlineOnly
                  ? "bg-blue-200 text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}>
              <span className="hidden sm:inline">Online</span>
              <span className="sm:hidden">Online</span>
              ({onlineUsers.filter((id) => id !== authUser._id).length-1})
            </button>
          </div>
        </div>

        {/* users list */}
        <div className="overflow-y-auto w-full p-2 flex-1">
          {filteredUsers?.length > 0 &&
            filteredUsers.map((user) => {
              return (
                <>
                <button
                  key={user._id}
                  onClick={() => handleUserSelect(user)}
                  className={`w-full md:mb-2 flex items-center px-3 py-3 lg:py-1 justify-start gap-3 transition-all duration-300 rounded-md hover:scale-[1.02] active:scale-[0.98] transform ${
                    selectedUser?._id === user._id
                      ? "bg-gray-200 ring-gray-200"
                      : "hover:bg-gray-200 hover:translate-x-1 lg:hover:translate-x-0"
                  }`}>
                  <div className="relative">
                    <img
                      className="w-12 h-12 object-cover rounded-full transition-all duration-300"
                      src={
                        user?.avatar?.url
                          ? user.avatar.url
                          : "/user-circle-svgrepo-com.svg"
                      }
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/user-circle-svgrepo-com.svg";
                      }}
                      alt="User Avatar"
                    />
                    {onlineUsers.includes(user._id) && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white animate-pulse transition-all duration-300" />
                    )}
                  </div>
                  {/* user info */}
                  <div className="text-left min-w-0 flex-1">
                    <div className="font-medium text-gray-800 truncate transition-all duration-300">
                      {user.username}
                    </div>
                    <div className="text-sm text-gray-500 transition-all duration-300">
                      {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                    </div>
                  </div>
                </button>
                <hr className="w-[90%] mx-auto opacity-6 mb-2 transition-all duration-300"/>
                </>
                
              );
            })}

          {filteredUsers?.length === 0 && !searchQuery && (
            <div className="text-center text-gray-500 py-4">
              No Online Users
            </div>
          )}

          {filteredUsers?.length === 0 && searchQuery && (
            <div className="text-center text-gray-500 py-4">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No users found for "{searchQuery}"</p>
              <button
                onClick={() => setSearchQuery("")}
                className="text-blue-500 hover:text-blue-600 text-sm mt-1">
                Clear search
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
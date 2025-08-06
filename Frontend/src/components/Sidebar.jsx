import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SidebarSkeleton from "../components/skeletons/SidebarSkeleton";
import { getUsers, setSelectedUser } from "../store/slices/chatSlice";
import { EllipsisVertical, Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import { logout } from "../store/slices/authSlice";

const Sidebar = () => {
  const [ShowOnlineOnly, setShowOnlineOnly] = useState(false);
  const [isOpen, setisOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
    dispatch(setSelectedUser(user));
  };

  return (
    <>
      <aside className="h-full w-[100vw] lg:w-72 border-r border-gray-200 flex flex-col transition-all duration-200 bg-white">
        {/* header */}
        <div className="flex justify-between items-center p-4 lg:p-3 mt-16 md:mt-0">
          <Link
            to={`/profile/${authUser.id}`}
            className="flex justify-start items-center flex-1">
            <div className="flex items-center justify-center lg:justify-start gap-2 transition-colors rounded-md">
              <img
                className="w-12 h-12 object-cover rounded-full"
                src={
                  authUser?.avatar?.url
                    ? authUser.avatar.url
                    : "/avatar-holder.avif"
                }
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/avatar-holder.avif";
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
                  className="hover:bg-gray-100 px-3 py-2 rounded-md font-medium whitespace-nowrap"
                  onClick={() => setisOpen(false)}>
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="hover:bg-gray-100 px-3 py-2 rounded-md font-medium text-left">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="border-b border-gray-200 w-full p-5 -mt-2">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-800">
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
          <div className="mt-3 flex gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setShowOnlineOnly(false)}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                !ShowOnlineOnly
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}>
              All Users
            </button>
            <button
              onClick={() => setShowOnlineOnly(true)}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                ShowOnlineOnly
                  ? "bg-white text-gray-900 shadow-sm"
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
                  className={`w-full md:mb-2 flex items-center px-3 py-3 lg:py-1 justify-start gap-3 transition-colors rounded-md ${
                    selectedUser?._id === user._id
                      ? "bg-gray-200 ring-gray-200"
                      : "hover:bg-gray-200"
                  }`}>
                  <div className="relative">
                    <img
                      className="w-12 h-12 object-cover rounded-full"
                      src={
                        user?.avatar?.url
                          ? user.avatar.url
                          : "/avatar-holder.avif"
                      }
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/avatar-holder.avif";
                      }}
                      alt="User Avatar"
                    />
                    {onlineUsers.includes(user._id) && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white" />
                    )}
                  </div>
                  {/* user info */}
                  <div className="text-left min-w-0 flex-1">
                    <div className="font-medium text-gray-800 truncate">
                      {user.username}
                    </div>
                    <div className="text-sm text-gray-500">
                      {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                    </div>
                  </div>
                </button>
                <hr className="w-[90%] mx-auto opacity-15 mb-2"/>
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
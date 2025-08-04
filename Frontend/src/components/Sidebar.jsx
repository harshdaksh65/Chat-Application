import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SidebarSkeleton from "../components/skeletons/SidebarSkeleton";
import { getUsers, setSelectedUser } from "../store/slices/chatSlice";
import { Bluetooth, Users } from "lucide-react";

const Sidebar = () => {
  const [ShowOnlineOnly, setShowOnlineOnly] = useState(false);
  const { users, selectedUser, isUsersLoading} = useSelector(
    (state) => state.chat
  );

  const {onlineUsers} = useSelector((state)=> state.auth);
  const { authUser } = useSelector((state) => state.auth);


  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(getUsers());
  },[dispatch])

  const filteredUsers = ShowOnlineOnly
  ? users.filter(user => user._id !== authUser._id && onlineUsers.includes(user._id))
  : users.filter(user => user._id !== authUser._id);



  if (isUsersLoading) return <SidebarSkeleton/>
  
  return (
    <>
      <aside className="h-full w-20 lg:w-72 border-r border-gray-200 flex flex-col transition-all duration-200 bg-white">
        {/* header */}
        <div className="border-b border-gray-200 w-full p-5">
          <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-gray-700"/>
              <span className="fonts-medium hidden lg:black text-gray-800">
                contacts
              </span>
          </div>

          {/* online only filter */}

          <div className="mt-3 hidden lg:flex items-center gap-2">
            <label className="cursor-pointer flex items-center gap-2 text-sm text-gray-700">
              <input className="w-4 h-4 border-gray-700 text-blue-600 focus:ring-blue-500" type="checkbox" checked={ShowOnlineOnly} onChange={(e)=> setShowOnlineOnly(e.target.checked)} />
              Show online Only
            </label>
            <span className="text-xs text-gray-500">
              ({onlineUsers.filter(id => id !== authUser._id).length} online)
            </span>
          </div>
        </div>

        {/* users list */}

        <div className="overflow-y-auto w-full py-3">
          {
            filteredUsers?.length > 0  && filteredUsers.map(user => {
              return (<button key={user._id} onClick={()=> dispatch(setSelectedUser(user))}
              className={`w-full flex items-center justify-center lg:justify-start gap-2 transition-colors rounded-md ${
                selectedUser?._id === user._id ? "bg-gray-200 ring-gray-200" : "hover:bg-gray-200" 
              }`}
              >
                <div className="">
                  <img className="w-12 h-12 object-cover rounded-full" src={user?.avatar?.url || "/avatar-holder.avif"} alt={"/avatar-holder.avif"}/>
                  {
                    onlineUsers.includes(user._id) && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white" />
                    )
                  }
                </div>
                {/* user info */}
                <div className="hidden lg:block text-left min-w-0">
                  <div className="font-medium text-gray-800 truncate">
                      {user.username}
                  </div>
                  <div className="text-sm text-gray-500">
                      {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                  </div>
                </div>

              </button>)
            })
          }

          {
            filteredUsers?.length === 0 && (
              <div className="text-center text-gray-500 py-4"> 
                No Online Users
              </div>
            )
          }

        </div>
      </aside>
    </>
  );
};

export default Sidebar;
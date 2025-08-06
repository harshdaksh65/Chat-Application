import { ArrowLeft, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../store/slices/chatSlice";

const ChatHeader = () => {
  const { selectedUser } = useSelector((state) => state.chat);
  const { onlineUsers } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleBackToSidebar = () => {
    dispatch(setSelectedUser(null));
  };

  return (
    <div className="p-3 bg-gray-200 ring-1 ring-gray-300">
      <div className="flex items-center justify-between">
        {/* USER INFO */}
        <div className="flex items-center gap-3">
          {/* Back Button - Mobile Only */}
          <button
            onClick={handleBackToSidebar}
            className="lg:hidden p-2 hover:bg-gray-300 rounded-full transition-colors"
            aria-label="Back to sidebar">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>

          {/* AVATAR */}
          <div className="relative w-10 h-10">
            <img
              className="w-12 h-12 object-cover rounded-full"
              src={selectedUser?.avatar?.url ? selectedUser.avatar.url : "/avatar-holder.avif"}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/avatar-holder.avif";
              }}
              alt="User Avatar"
            />
            {onlineUsers.includes(selectedUser?._id) && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-white border-2 rounded-full" />
            )}
          </div>

          <div>
            <h3 className="font-medium">{selectedUser?.username}</h3>
            <p className="text-sm">
              {onlineUsers.includes(selectedUser?._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close Button - Desktop Only */}
        <button
          onClick={handleBackToSidebar}
          className="hidden lg:block text-gray-800 hover:text-black transition">
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
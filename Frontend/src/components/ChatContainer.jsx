import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMessages } from "../store/slices/chatSlice";
import { getSocket } from "../lib/Socket";
import MessageInput from "./MessageInput";
import MessagesSkeleton from "./skeletons/MessageSkeleton";
import ChatHeader from "./ChatHeader";

const ChatContainer = () => {
  const { messages, isMessagesLoading, selectedUser } = useSelector(
    (state) => state.chat
  );

  const { authUser } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const messageEndRef = useRef(null);

  useEffect(() => {
    dispatch(getMessages(selectedUser._id));
  }, [selectedUser._id]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  function formatMessageTime(data) {
    const date = new Date(data);
    if (isNaN(date)) return "Invalid time";
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  useEffect(() => {
    if (!selectedUser?._id) return;

    dispatch(getMessages(selectedUser._id)); // Initial load
    const socket = getSocket();
    if (!socket) return;

    // ✅ ADD THIS BLOCK
    const handleNewMessage = (message) => {
      console.log("🔁 Received via socket:", message);
      if (
        message.senderID === selectedUser._id ||
        message.receiverID === selectedUser._id
      ) {
        dispatch({ type: "chat/pushNewMessage", payload: message });
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage); // Clean up
    };
  }, [selectedUser?._id]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto w-full">
        <ChatHeader />
        <MessagesSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 flex flex-col overflow-hidden bg-white w-full mt-0 relative z-30 animate-fadeIn">
        <ChatHeader />
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.length > 0 &&
            messages.map((message, index) => {
              const isSender =
                message.senderID?._id === authUser?._id ||
                message.senderID === authUser?._id;
              return (
                <div
                  key={message._id || index}
                  className={`flex items-end ${
                    isSender ? "justify-end" : "justify-start"
                  }`}
                  ref={index === messages.length - 1 ? messageEndRef : null}>
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden  shrink-0 ${
                      isSender ? "order-2 ml-2 sm:ml-3" : "order-1 mr-2 sm:mr-3"
                    }`}>
                    <img
                      src={
                        isSender && authUser?.avatar?.url
                          ? authUser.avatar.url || "/user-circle-svgrepo-com.svg"
                          : selectedUser?.avatar?.url || "/user-circle-svgrepo-com.svg"
                      }
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/user-circle-svgrepo-com.svg";
                      }}
                      alt="User Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* BUBBLE  */}
                  <div
                    className={`max-w-[75%] sm:max-w-xs md:max-w-md px-3 sm:px-4 py-2 rounded-xl text-sm ${
                      isSender
                        ? "text-white font-medium order-1 bg-gradient-to-r from-blue-500 to-purple-600"
                        : "bg-gray-200 text-black order-2"
                    }`}>
                    {message.media && (
                      <>
                        {message.media.includes(".mp4") ||
                        message.media.includes(".webm") ||
                        message.media.includes(".mov") ? (
                          <video
                            src={message.media}
                            controls
                            className="w-full rounded-md mb-2"
                          />
                        ) : (
                          <img
                            src={message.media}
                            alt="Attachment"
                            className="w-full rounded-md mb-2"
                          />
                        )}
                      </>
                    )}

                    {message.text && <p className="break-words ">{message.text}</p>}

                    <span className="block text-[10px] text-right text-gray-400 ">
                      {formatMessageTime(message.createdAt)}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
        <MessageInput />
      </div>
    </>
  );
};

export default ChatContainer;
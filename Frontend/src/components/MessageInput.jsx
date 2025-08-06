import { Image, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSocket } from "../lib/Socket";
import axios from "../lib/axios";
import { toast } from "react-toastify";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [mediaPreview, setMediaPreview] = useState(null);
  const [media, setMedia] = useState(null);
  const [mediaType, setMediaType] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const dispatch = useDispatch();
  const { selectedUser } = useSelector((state) => state.chat);
  const { authUser } = useSelector((state) => state.auth);

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setMedia(file);
    const type = file.type;
    if (type.startsWith("image/")) {
      setMediaType("image");
      const reader = new FileReader();
      reader.onload = () => {
        setMediaPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else if (type.startsWith("video/")) {
      setMediaType("video");
      const videoUrl = URL.createObjectURL(file);
      setMediaPreview(videoUrl);
    } else {
      toast.error("Please select an image or video file.");
      setMedia(null);
      setMediaPreview(null);
      setMediaType("");
      return;
    }
  };

  const removeMedia = () => {
    setMedia(null);
    setMediaPreview(null);
    setMediaType("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!text.trim() && !media) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("text", text);
      if (media) {
        formData.append("media", media);
      }

      const { data } = await axios.post(
        `/messages/send/${selectedUser._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percent);
          },
        }
      );

      const messageObj = data.data;

      // ✅ Sender sees it instantly
      dispatch({ type: "chat/pushNewMessage", payload: messageObj });

      // Reset
      setText("");
      removeMedia();
      setUploadProgress(0);
      setIsUploading(false);
    } catch (err) {
      console.error("❌ Failed to send message:", err);
      toast.error("Failed to send message.");
      setIsUploading(false);
    }
  };

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      if (
        newMessage.senderId === selectedUser?._id ||
        newMessage.receiverId === selectedUser?._id
      ) {
        dispatch({ type: "chat/pushNewMessage", payload: newMessage });
      }
    };

    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [selectedUser?._id]);

  return (
    <div className="p-3 sm:p-4 w-full border-t border-gray-200">
      {/* Upload progress bar */}
      {isUploading && (
        <div className="w-full h-2 bg-gray-200 rounded overflow-hidden mb-2">
          <div
            className="h-full bg-blue-500 transition-all duration-300 ease-in-out"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}

      {/* Media preview */}
      {mediaPreview && (
        <div className="mb-2 flex items-center gap-2">
          <div className="relative">
            {mediaType === "image" ? (
              <img
                src={mediaPreview}
                alt="Preview"
                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-gray-300"
              />
            ) : (
              <video
                src={mediaPreview}
                controls
                className="w-24 h-16 sm:w-32 sm:h-20 object-cover rounded-lg border border-gray-300"
              />
            )}
            <button
              onClick={removeMedia}
              type="button"
              className="absolute -top-2 -right-2 w-5 h-5 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-black">
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Input + File + Send Form */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <input
            type="file"
            accept="image/*,video/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleMediaChange}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-300 hover:border-gray-400 transition ${
              mediaPreview ? "text-emerald-500 border-emerald-500" : "text-gray-400"
            }`}>
            <Image size={16} className="sm:w-5 sm:h-5" />
          </button>
        </div>

        <button
          type="submit"
          className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={(!text.trim() && !media) || isUploading}>
          <Send size={16} className="sm:w-5 sm:h-5" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
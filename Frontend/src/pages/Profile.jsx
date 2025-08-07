import { LogOut, ChevronLeft, Camera, Loader2, Mail, User } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../store/slices/authSlice";
import { logout } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { authUser, isUpdatingProfile } = useSelector((state) => state.auth);

  const [selectedImage, setSelectedImage] = useState(null);

  const [formData, setFormData] = useState({
    username: authUser?.username,
    email: authUser?.email,
    avatar: authUser?.avatar?.url,
  });

  const dispatch = useDispatch();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      const base64Image = reader.result;
      setSelectedImage(base64Image);
      setFormData({ ...formData, avatar: file });
    };
  };

  const handleUpdateProfile = () => {
    const data = new FormData();
    data.append("username", formData.username);
    data.append("email", formData.email);
    data.append("avatar", formData.avatar);
    dispatch(updateProfile(data));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const navigate = useNavigate();

  return (
    <>
      <div className="min-h-screen pt-20 bg-gray-50">
        <div className="max-w-2xl mx-auto p-4 py-8">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 -mt-6 flex justify-center bg-blue-100 cursor-pointer px-3 py-1 rounded-full gap-1 text-sm text-blue-600 ">
            <ChevronLeft/>
            <h1 className="font-semibold text-center">Messages</h1>
          </button>
          <div className="bg-white rounded-xl shadow-xl p-6 space-y-8">
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-gray-800">Profile</h1>
              <p className="mt-2 text-gray-500">Your profile information:</p>
            </div>

            {/* <!-- Avatar Upload --> */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <img
                  src={
                    selectedImage || formData?.avatar || "/user-circle-svgrepo-com.svg"
                  }
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/user-circle-svgrepo-com.svg";
                  }}
                  alt="/user-circle-svgrepo-com.svg"
                  className="w-32 h-32 rounded-full object-cover object-top border-4 border-gray-200"
                />

                <label
                  htmlFor="avatar-upload"
                  className={`absolute bottom-0 right-0 bg-gray-800 hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ${
                    isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                  }`}>
                  <Camera className="w-5 h-5 text-white" />
                  <input
                    type="file"
                    id="avatar-upload"
                    className=" hidden "
                    onChange={handleImageUpload}
                    disabled={isUpdatingProfile}
                  />
                </label>
              </div>

              <p className="text-sm text-gray-400">
                {isUpdatingProfile
                  ? "Uploading..."
                  : "click the camera icon to upload profile photo"}
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-1.5">
                <div className="text-sm text-gray-600 flex items-center gap-2">
                  <User className="w-4 h-4" /> Username
                </div>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="px-4 py-2.5 bg-gray-100 rounded-lg border border-gray-300 text-gray-800 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <div className="text-sm text-gray-600 flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Email Address
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="px-4 py-2.5 bg-gray-100 rounded-lg border border-gray-300 text-gray-800 focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleUpdateProfile}
              disabled={isUpdatingProfile}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition duration-200 flex justify-center items-center gap-2">
              {isUpdatingProfile ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Loading...{" "}
                </>
              ) : (
                "Update Profile"
              )}
            </button>
            <button
              onClick={handleLogout}
              className="w-full -mt-4 bg-red-300 inline-flex justify-center items-center gap-2 py-2 rounded-md text-sm font-medium text-red-700 hover:bg-red-100 transition">
              <LogOut className="w-5 h-5 " />
              <span className="">Logout</span>
            </button>

            <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">
                {" "}
                Account Info
              </h2>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center justify-between p-2 border-b border-gray-200">
                  <span className="font-Sans">Member Since</span>
                  <span className="font-semibold">
                    {authUser?.createdAt?.split("T")[0]}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2">
                  <span className="font-Sans">Account status</span>
                  <span className="text-green-600 font-medium">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;

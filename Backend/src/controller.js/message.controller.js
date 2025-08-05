const {catchAsyncError} = require("../middlewares/catchAsyncError.middleware");
const User = require("../models/user.model");
const Message = require("../models/message.model");
const { get } = require("mongoose");
const { getReceiverSocket, getIO } = require("../utils/socket");
const cloudinary = require("cloudinary").v2;
const socket = require("../utils/socket");

exports.getAllUsers = catchAsyncError(async (req, res, next) => {
  const user = req.user;

  const filteredUsers = await User.find({
    _id: { $ne: user._id },
  }).select("-password -__v");
  res.status(200).json({
    success: true,
    users: filteredUsers,
  });
});

exports.getMessages = catchAsyncError(async (req, res, next) => {
  const receiverId = req.params.id;
  const myID = req.user._id;
  const receiver = await User.findById(receiverId).select("-password -__v");
  if (!receiver) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const messages = await Message.find({
    $or: [
      { senderID: myID, receiverID: receiverId },
      { senderID: receiverId, receiverID: myID },
    ],
  }).sort({ createdAt: 1 });

  res.status(200).json({
    success: true,
    messages,
  });
});

exports.sendMessage = catchAsyncError(async (req, res, next) => {
  const { id: receiverId } = req.params;
  const { text } = req.body;
  const media = req?.files?.media;
  const senderId = req.user._id;

  const receiver = await User.findById(receiverId);
  if (!receiver) {
    return res.status(404).json({
      success: false,
      message: "Receiver not found",
    });
  }

  const sanitizedText = text ? text.trim() : "";

  if (!sanitizedText && !media) {
    return res.status(400).json({
      success: false,
      message: "Message content is required",
    });
  }

  let mediaUrl = "";
console.log("MEDIA", media); // <- helpful debugging log

if (media) {
  try {
    const uploadedResponse = await cloudinary.uploader.upload(
      media.tempFilePath,
      {
        resource_type: "auto",
        folder: "ChatApp/Media",
        transformation: [
          { width: 1080, height: 1080, crop: "limit" },
          { quality: "auto", fetch_format: "auto" },
        ],
      }
    );
    mediaUrl = uploadedResponse?.secure_url;
  } catch (error) {
    console.error("Error uploading media:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to upload media",
    });
  }
}
  console.log({
  senderId,
  receiverId,
  sanitizedText,
  media,
});

  const message = await Message.create({
    senderID: senderId,
    receiverID: receiverId,
    text: sanitizedText,
    media: mediaUrl,
  });

  const receiverSocketID = getReceiverSocket(receiverId);
    if (receiverSocketID) {
        
      const ioInstance = getIO(); // ✅ Get initialized Socket.IO instance
      ioInstance.to(receiverSocketID).emit("newMessage", message);

    }
  res.status(201).json({
    success: true,
    data: message,
  });
});
exports.deleteMessage = catchAsyncError(async (req, res, next) => {
  // Your code to delete a message
});
exports.updateMessage = catchAsyncError(async (req, res, next) => {
  // Your code to update a message
});

import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import { v2 as cloudinary } from "cloudinary";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // get users and count unread messages from each user
    const filteredUsers = await User.aggregate([
      { $match: { _id: { $ne: loggedInUserId } } },
      {
        // "messages" is the default collection name for the "Message" model
        $lookup: {
          from: "messages",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    // The user in question is the sender
                    { $eq: ["$senderId", "$$userId"] },
                    // The logged-in user is the receiver
                    { $eq: ["$receiverId", loggedInUserId] },
                    // Message is unread
                    { $eq: ["$readAt", null] },
                  ],
                },
              },
            },
          ],
          as: "unreadMessages",
        },
      },
      {
        $project: {
          _id: 1,
          fullName: 1,
          profileImage: 1,
          // The size of the array from $lookup is the count of unread messages
          unreadMessages: { $size: "$unreadMessages" },
        },
      },
    ]);

    res.status(200).json({ success: true, data: filteredUsers });
  } catch (error) {
    console.log("Error in getUsersForSidebar controller: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;

    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    // realtime send message
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const readAllMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    await Message.updateMany(
      { senderId: userToChatId, receiverId: myId },
      { $set: { readAt: Date.now() } }
    );

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    console.log("Error in readAllMessages controller: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

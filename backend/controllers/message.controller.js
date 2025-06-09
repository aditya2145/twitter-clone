const Conversation = require("../models/conversation.model");
const Message = require("../models/message.model");
const User = require("../models/user.model");


const sendMessage = async (req, res) => {
    try {
        const senderId = req.user._id;
        const { receiverId, text, image } = req.body;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId], $size: 2 }
        }).populate("participants", "username profileImg");

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
        }

        if (conversation.deletedBy?.includes(senderId)) {
            conversation.deletedBy = conversation.deletedBy.filter((id) => id.toString() !== senderId.toString());
        }

        const newMessage = await Message.create({
            conversation: conversation._id,
            sender: senderId,
            text,
            image,
        });

        conversation.lastMessage = newMessage._id;
        await conversation.save();

        const populatedMessage = await newMessage.populate("sender", "username profileImg");

        // Emit message to receiver via Socket.IO
        if (global.io) {
            global.io.to(receiverId).emit("newMessage", populatedMessage);
        }

        res.status(201).json(populatedMessage);
    } catch (error) {
        res.status(500).json({ message: "Error sending message", error });
    }
};


const getAllConversations = async (req, res) => {
    try {
        const me = req.user._id;

        let conversations = await Conversation.find({
            participants: me,
            deletedBy: { $ne: me },
        })
            .sort({ updatedAt: -1 })
            .populate("participants", "username profileImg")
            .populate({
                path: "lastMessage",
                populate: {
                    path: "sender",
                    select: "username profileImg",
                }
            });

        const filteredConversations = conversations.map((conversation) => {
            const otherUser = conversation.participants.find(
                (p) => p._id.toString() !== me.toString()
            );

            return {
                _id: conversation._id,
                user: {
                    _id: otherUser._id,
                    username: otherUser.username,
                    profileImg: otherUser.profileImg,
                },
                lastMessage: conversation.lastMessage
                    ? {
                        text: conversation.lastMessage.text,
                        image: conversation.lastMessage.image,
                        sender: conversation.lastMessage.sender,
                        createdAt: conversation.lastMessage.createdAt,
                    }
                    : null,
                updatedAt: conversation.updatedAt,
            };
        });

        res.status(200).json(filteredConversations);


    } catch (error) {
        console.log("Error in getAllConversations controller:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getConversation = async (req, res) => {
    try {
        const { username } = req.params;
        const myId = req.user._id;

        const otherUser = await User.findOne({ username });

        if (!otherUser) {
            return res.status(404).json({ error: "User not found" });
        }

        // Make sure user is part of the conversation
        let conversation = await Conversation.findOne({
            participants: { $all: [myId, otherUser._id], $size: 2 }
        }).populate("participants", "username profileImg");

        if (!conversation) {
            return res.status(404).json({ error: "Conversation not found" });
        }

        // Fetch all messages in this conversation
        const messages = await Message.find({ conversation: conversation._id })
            .populate("sender", "username profileImg")
            .sort({ createdAt: 1 }); // oldest to newest

        res.status(200).json({
            messages,
        });
    } catch (error) {
        console.log("Error in getConversation controller:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
    sendMessage,
    getAllConversations,
    getConversation,
}
const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
    },
    deletedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
}, { timestamps: true });

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
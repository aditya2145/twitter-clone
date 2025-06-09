const cloudinary = require('cloudinary').v2;
const User = require("../models/user.model.js");
const Post = require("../models/post.model.js");
const Notification = require('../models/notification.model');

const createPost = async (req, res) => {
    try {
        const { text } = req.body;
        let file = req.file;
        if (!text && !file) {
            return res.status(400).json({ error: "Post must have text or image" });
        }

        const userId = req.user._id.toString();
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        let uploadedUrl = '';
        if (file) {
            const uploadRes = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { resource_type: 'auto', folder: 'posts' },
                    (err, result) => {
                        if (err) return reject(err);
                        resolve(result);
                    }
                ).end(file.buffer);
            });

            uploadedUrl = uploadRes.secure_url;
        }

        const newPost = new Post({
            user: userId,
            text,
            img: uploadedUrl,
        });
        await newPost.save();

        res.status(201).json(newPost);
    } catch (error) {
        console.log("Error in createPost controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const likeUnlikePost = async (req, res) => {
    try {
        const { id: postId } = req.params;
        const userId = req.user._id;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post Not Found" });
        }

        const userLikedPost = post.likes.includes(userId);

        if (userLikedPost) {
            await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
            await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });

            res.status(200).json({ message: "Post Unliked Successfully" });
        }
        else {
            post.likes.push(userId);
            await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
            await post.save();

            if (userId.toString() !== post.user.toString()) {
                const notification = new Notification({
                    from: userId,
                    to: post.user,
                    type: "like",
                });
                await notification.save();
            }

            const updatedLikes = post.likes;
            res.status(200).json(updatedLikes);
        }

    } catch (error) {
        console.log("Error in likeUnlikePost controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

const likedPosts = async (req, res) => {
    try {
        const { username } = req.params;

        const user = await User.findOne({ username })
            .populate({
                path: "likedPosts",
                populate: {
                    path: "user", // ✅ match the Post schema
                    select: "-password",
                }
            })
            .select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user.likedPosts);

    } catch (error) {
        console.log("Error in likedPosts controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const commentOnPost = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: "Text field is required" });
        }

        const { id: postId } = req.params;
        const userId = req.user._id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post Not Found" });
        }

        const comment = { user: userId, text };
        post.comments.push(comment);
        await post.save();

        res.status(200).json(comment);

    } catch (error) {
        console.log("Error in commentOnPost controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

const deletePost = async (req, res) => {
    try {
        const { id: postId } = req.params;
        const userId = req.user._id.toString();

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post Not Found" });
        }

        if (post.user.toString() !== userId) {
            return res.status(401).json({ error: "You are not authorized to delete this post" });
        }

        if (post.img) {
            const imgId = post.img.split('/').pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(postId);

        res.status(200).json({ message: "Post deleted successfully" });

    } catch (error) {
        console.log("Error in deletePost controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

const editPost = async (req, res) => {
    try {
        const { id: postId } = req.params;
        const { text } = req.body;
        const userId = req.user._id.toString();

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        if (post.user.toString() !== userId) {
            return res.status(401).json({ error: "You are not authorized to edit this post" });
        }

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { $set: { text } },
            { new: true }
        );

        res.status(200).json({ message: "Post edited successfully", post: updatedPost });

    } catch (error) {
        console.error("Error in editPost controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};


const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate({
                path: "user",
                select: "-password",
            })
            .populate({
                path: "comments.user",
                select: "-password",
            });

        if (posts.length === 0) {
            return res.status(200).json([]);
        }

        res.status(200).json(posts);
    } catch (error) {
        console.log("Error in getAllPosts controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

const getFollowingPosts = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        const following = user.following;

        const feedPosts = await Post.find({ user: { $in: following } })
            .sort({ createdAt: -1 })
            .populate({
                path: "user",
                select: "-password",
            })
            .populate({
                path: "comments.user",
                select: "-password",
            });

        res.status(200).json(feedPosts);
    } catch (error) {
        console.log("Error in getFollowingPosts controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

const getUserPosts = async (req, res) => {
    try {
        const { username } = req.params;

        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ error: "User not found" });

        const posts = await Post.find({ user: user._id })
            .sort({ createdAt: -1 })
            .populate({
                path: "user",
                select: "-password",
            })
            .populate({
                path: "comments.user",
                select: "-password",
            });

        res.status(200).json(posts);
    } catch (error) {
        console.log("Error in getUserPosts controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}


module.exports = {
    createPost,
    likeUnlikePost,
    commentOnPost,
    deletePost,
    editPost,
    getAllPosts,
    getFollowingPosts,
    getUserPosts,
    likedPosts,
}
const bcrypt = require('bcrypt');
const cloudinary = require('cloudinary').v2;
 
// models
const User = require('../models/user.model');
const Notification = require('../models/notification.model');


const getUserProfile = async (req, res) => {
	const { username } = req.params;

	try {
		const user = await User.findOne({ username }).select("-password");
		if (!user) return res.status(404).json({ message: "User not found" });

		res.status(200).json(user);
	} catch (error) {
		console.log("Error in getUserProfile: ", error.message);
		res.status(500).json({ error: error.message });
	}
};

const followUnfollowUser = async (req, res) => {
	try {
		const { username } = req.params;
		const userToModify = await User.findOne({username});
		const currentUser = await User.findById(req.user._id);
		const id = userToModify?._id;

		if (id === req.user._id.toString()) {
			return res.status(400).json({ error: "You can't follow/unfollow yourself" });
		}

		if (!userToModify || !currentUser) return res.status(400).json({ error: "User not found" });

		const isFollowing = currentUser.following.includes(id);

		if (isFollowing) {
			// Unfollow the user
			await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
			await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });

			res.status(200).json({ message: "User unfollowed successfully" });
		} else {
			// Follow the user
			await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
			await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
			// Send notification to the user
			const newNotification = new Notification({
				type: "follow",
				from: req.user._id,
				to: userToModify._id,
			});

			await newNotification.save();

			res.status(200).json({ message: "User followed successfully" });
		}
	} catch (error) {
		console.log("Error in followUnfollowUser: ", error.message);
		res.status(500).json({ error: error.message });
	}
};

const getSuggestedUsers = async (req, res) => {
	try {
		const userId = req.user._id;

		const usersFollowedByMe = await User.findById(userId).select("following");

		const users = await User.aggregate([
			{
				$match: {
					_id: { $ne: userId },
				},
			},
			{ $sample: { size: 10 } },
		]);

		// 1,2,3,4,5,6,
		const filteredUsers = users.filter((user) => !usersFollowedByMe.following.includes(user._id));
		const suggestedUsers = filteredUsers.slice(0, 4);

		suggestedUsers.forEach((user) => (user.password = null));

		res.status(200).json(suggestedUsers);
	} catch (error) {
		console.log("Error in getSuggestedUsers: ", error.message);
		res.status(500).json({ error: error.message });
	}
};

const updateUser = async (req, res) => {
  const { fullName, currentPassword, newPassword, bio } = req.body;
  const userId = req.user._id;

  try {
    let user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if ((newPassword && !currentPassword) || (!newPassword && currentPassword)) {
      return res.status(400).json({ error: "Both current and new password are required" });
    }

    if (newPassword && currentPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) return res.status(400).json({ error: "Incorrect current password" });

      if (newPassword.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters long" });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    if (req.files?.profileImg) {
      if (user.profileImg) {
        const publicId = user.profileImg.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }

      const streamUpload = (buffer) =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: "image" },
            (error, result) => {
              if (result) resolve(result.secure_url);
              else reject(error);
            }
          );
          stream.end(buffer);
        });

      user.profileImg = await streamUpload(req.files.profileImg[0].buffer);
    }

    if (req.files?.coverImg) {
      if (user.coverImg) {
        const publicId = user.coverImg.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }

      const streamUpload = (buffer) =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: "image" },
            (error, result) => {
              if (result) resolve(result.secure_url);
              else reject(error);
            }
          );
          stream.end(buffer);
        });

      user.coverImg = await streamUpload(req.files.coverImg[0].buffer);
    }

    user.fullName = fullName || user.fullName;
    user.bio = bio || user.bio;

    await user.save();
    user.password = null;

    res.status(200).json(user);
  } catch (error) {
    console.error("Error in updateUser: ", error);
    res.status(500).json({ error: error.message });
  }
};


const findUser = async(req, res) => {
	const { username } = req.body;
	
	const user = await User.findOne({ username }).select("-password");

	if(!user) {
		return res.status(404).json({ message: "User Not Found" });
	}

	res.status(200).json(user);
};

const getConnections = async(req, res) => {
	try {
		const { username, connectionType } = req.params;

		const user = await User.findOne({ username }).select(`username fullName profileImg`).populate({
			path: `${connectionType}`,
			select: "username fullName profileImg",
		})

		if(!user) {
			return res.status(404).json({ message: "User Not Found" });
		}
		res.status(200).json(user);
	} catch (error) {
		console.log("Error in getConnections controller:", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

module.exports = {
    getUserProfile,
    followUnfollowUser,
    getSuggestedUsers,
    updateUser,
	findUser,
	getConnections,
}
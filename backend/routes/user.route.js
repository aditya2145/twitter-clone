const { protectRoute } = require('../middlewares/protectRoute.js');

const { getUserProfile, getSuggestedUsers, followUnfollowUser, updateUser, findUser, getConnections } = require('../controllers/user.controller.js');
const { upload } = require('../middlewares/multer.js')

const express = require('express');

const router = express.Router();

router.get("/profile/:username", protectRoute, getUserProfile);
router.get("/suggested", protectRoute, getSuggestedUsers);
router.post("/follow/:username", protectRoute, followUnfollowUser);
router.put("/update", protectRoute, upload.fields([{name: 'profileImg', maxCount: 1}, {name: 'coverImg', maxCount: 1}]), updateUser);
router.post('/searchUser', findUser);
router.get('/connections/:username/:connectionType', getConnections);

module.exports = router; 
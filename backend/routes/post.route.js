const express = require('express');
const { createPost, likeUnlikePost, deletePost, commentOnPost, editPost, getPost, deleteComment, getAllPosts, getUserPosts, getFollowingPosts, likedPosts } = require('../controllers/post.controller');
const { protectRoute } = require('../middlewares/protectRoute');
const { upload } = require('../middlewares/multer');

const router = express.Router();

router.post('/create', protectRoute, upload.single('file'), createPost);
router.put('/edit/:id', protectRoute, editPost);
router.post('/like/:id', protectRoute, likeUnlikePost);
router.post('/comment/:id', protectRoute, commentOnPost);
router.delete('/:id', protectRoute, deletePost);
router.get('/all', getAllPosts);
router.get('/user/:username', getUserPosts);
router.get('/following', protectRoute, getFollowingPosts);
router.get('/likedPosts/:username', likedPosts);

module.exports = router;
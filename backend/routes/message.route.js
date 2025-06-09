const express = require('express');
const { getAllConversations, getConversation, sendMessage } = require('../controllers/message.controller');
const {protectRoute} = require('../middlewares/protectRoute.js')

const router = express.Router();

router.get('/allconversations', protectRoute, getAllConversations);
router.get('/conversation/:username', protectRoute, getConversation);
router.post('/send', protectRoute, sendMessage);

module.exports = router;
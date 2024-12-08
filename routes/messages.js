const express = require('express');
const MessageController = require('../controllers/MessageController');

const router = express.Router();

router.post("/users/sendMessage", MessageController.sendMessage);
router.post("/users/getMessage", MessageController.getMessage);

module.exports = router;

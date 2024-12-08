const express = require('express');
const UserController = require('../controllers/UserController');
const upload = require('../middleware/upload');

const router = express.Router();

router.post("/create", upload.fields([{ name: "avatar", maxCount: 1 }, { name: "music", maxCount: 1 }]), UserController.createUser);
router.post("/recommend", UserController.recommendUsers);
router.post("/matches", UserController.getMatches);

module.exports = router; // Ensure this line is present

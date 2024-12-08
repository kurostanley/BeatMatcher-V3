const express = require('express');
const RequestController = require('../controllers/RequestController');

const router = express.Router();

router.post("/create", RequestController.createRequest);

module.exports = router;

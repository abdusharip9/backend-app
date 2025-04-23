const express = require('express');
const router = express.Router();
const { createSubscription } = require('../controllers/subscription');

router.post('/subscription', createSubscription);

module.exports = router;

const express = require('express');
const router = express.Router();
const featureController = require('../controllers/featureController');
const checkAdminMiddleware = require('../middlewares/checkAdmin.middleware')
const authMiddleware = require('../middlewares/auth.middleware')

// router.post('/create', authMiddleware, checkAdminMiddleware, featureController.createFeature);
router.post('/create', featureController.createFeature);
router.get('/get-all', featureController.getAllFeatures);
router.delete('/delete/:feature_id', featureController.deleteFeature);
router.put('/update/:feature_id', featureController.updateFeature);

module.exports = router;

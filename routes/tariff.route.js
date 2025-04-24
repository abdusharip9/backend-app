const express = require('express')
const authMiddleware = require('../middlewares/auth.middleware')
const checkAdminMiddleware = require('../middlewares/checkAdmin.middleware')
const { createTariff, getAllTariffs, deleteTariff, updateTariff, checkFreeTrial, selectTariff, checkKafeTariff, getOneTariff } = require('../controllers/tariff.controller')

const router = express.Router()

router.post('/create', authMiddleware, checkAdminMiddleware, createTariff)
router.get('/get-all', getAllTariffs);
router.get('/get-one/:tarif_id', getOneTariff);
router.delete('/delete/:tarif_id', authMiddleware, checkAdminMiddleware, deleteTariff);
router.put('/update/:tarif_id', authMiddleware, checkAdminMiddleware, updateTariff)
router.get('/check-free-trial', authMiddleware, checkFreeTrial);
router.post('/select-tariff', authMiddleware, selectTariff);
router.get('/check-kafe-tariff/:kafe_id', authMiddleware, checkKafeTariff)

module.exports = router

const express = require('express')
const authMiddleware = require('../middlewares/auth.middleware')
const checkAdminMiddleware = require('../middlewares/checkAdmin.middleware')
const { createTariff, getAllTariffs, deleteTariff, updateTariff, checkFreeTrial, selectTariff, checkUserTariff } = require('../controllers/tariff.controller')

const router = express.Router()

router.post('/create', authMiddleware, checkAdminMiddleware, createTariff)
router.get('/get-all', authMiddleware, getAllTariffs);
router.delete('/delete/:tarif_id', authMiddleware, checkAdminMiddleware, deleteTariff);
router.put('/update/:tarif_id', authMiddleware, checkAdminMiddleware, updateTariff)
router.get('/check-free-trial', authMiddleware, checkFreeTrial);
router.post('/select-tariff', authMiddleware, selectTariff);
router.get('/check-user-tariff', authMiddleware, checkUserTariff)



module.exports = router

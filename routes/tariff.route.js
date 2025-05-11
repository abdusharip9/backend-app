const express = require('express')
const authMiddleware = require('../middlewares/auth.middleware')
const checkAdminMiddleware = require('../middlewares/checkAdmin.middleware')
const { createTariff, getAllTariffs, deleteTariff, updateTariff, checkFreeTrial, selectTariff, checkKafeTariff, getOneTariff } = require('../controllers/tariff.controller')

const router = express.Router()

router.post('/create', createTariff)
router.get('/get-all', getAllTariffs);
router.get('/get-one/:tarif_id', getOneTariff);
router.delete('/delete/:tarif_id', deleteTariff);
router.put('/update/:tarif_id', updateTariff)
router.get('/check-free-trial', checkFreeTrial);
router.post('/select-tariff', selectTariff);
router.get('/check-kafe-tariff/:kafe_id', checkKafeTariff)

module.exports = router

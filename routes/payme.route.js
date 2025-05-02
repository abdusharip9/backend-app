const paymeController = require('../controllers/payme.controller')
const paymeMiddleware = require('../middlewares/payme.middleware')
const router = require('express').Router()

// router.post('/payments', paymeCheckToken, transactionController.payme)
router.post('/pay', paymeMiddleware, paymeController.payme)
router.post('/checkout', paymeMiddleware, paymeController.checkout)

module.exports = router
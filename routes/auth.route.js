const express = require('express')
const authController = require('../controllers/auth.controller')
const { body, validationResult } = require('express-validator')

const router = express.Router()

router.post(
	'/register', 
	body('email')
		.isEmail()
		.withMessage('Email formati noto`g`ri'), 
	body('password')
		.isLength({ min: 4, max: 30 })
		.withMessage('Parol o`lchamida xatolik'),
	(req, res, next) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}
		next()
	},
	authController.register
)
router.post('/verify-code', authController.verifyCode)
router.post('/login', authController.login)
router.post('/logout', authController.logout)
router.get('/refresh', authController.refresh)


router.get('/ping', (req, res) => {
	res.status(200).json({ message: 'Server is alive' })
})

setInterval(() => {
	fetch('https://backend-app-5rtx.onrender.com/api/auth/api/ping')
		.then(res => console.log('✅ Ping sent to keep the server alive'))
		.catch(err => console.error('❌ Ping failed:', err))
}, 600000)

module.exports = router

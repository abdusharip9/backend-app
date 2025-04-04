const express = require('express')
const authController = require('../controllers/auth.controller')
const { body, validationResult } = require('express-validator')
const authMiddleware = require('../middlewares/auth.middleware')

const router = express.Router()

router.post(
	'/register',
	body('email').isEmail().withMessage('Invalid email format'),
	body('password')
		.isLength({ min: 4, max: 30 })
		.withMessage('Password must be between 4 and 30 characters'),
	// checking errors and return errors
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
router.get('/getUser/:id', authMiddleware, authController.getUser)
router.post('/update-user/:id', authMiddleware, authController.updateUser)
router.post(
	'/update-user/add-kafeName/:id',
	authMiddleware,
	authController.addKafe
)
router.post(
	'/update-user/add-phone/:id',
	authMiddleware,
	authController.addPhone
)
router.post(
	'/update-user/delete-kafeName/:id',
	authMiddleware,
	authController.deleteKafe
)
router.post(
	'/update-user/delete-phone/:id',
	authMiddleware,
	authController.deletePhone
)
// router.post(
// 	'/update-user/edit-kafe/:id',
// 	authMiddleware,
// 	authController.deleteKafe
// )

router.get('/ping', (req, res) => {
	res.status(200).json({ message: 'Server is alive' })
})

setInterval(() => {
	fetch('https://backend-app-5rtx.onrender.com/api/auth/api/ping')
		.then(res => console.log('✅ Ping sent to keep the server alive'))
		.catch(err => console.error('❌ Ping failed:', err))
}, 600000) // 10 daqiqa (600000 ms)

module.exports = router

const express = require('express')
const authController = require('../controllers/auth.controller')
const { body, validationResult } = require('express-validator')

const router = express.Router()

router.post(
	'/register',
	body('email').isEmail().withMessage('Invalid email format'),
	body('password')
		.isLength({ min: 3, max: 30 })
		.withMessage('Password must be between 3 and 30 characters'),
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
router.post('/login', authController.login)

module.exports = router

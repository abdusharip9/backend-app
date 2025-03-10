const jwt = require('jsonwebtoken')
const authService = require('../services/auth.service')
const usersModel = require('../models/users.model')
const BaseError = require('../errors/base.error')

class AuthController {
	async register(req, res, next) {
		try {
			const { email, password } = req.body
			const data = await authService.register(email, password)
			return res.json({ data })
		} catch (error) {
			next(error)
		}
	}

	async login(req, res, next) {
		try {
			const { email, password } = req.body
			console.log(email, password)

			const data = await authService.login(email, password)
			return res.json(data)
		} catch (error) {
			next(error)
		}
	}
}

module.exports = new AuthController()

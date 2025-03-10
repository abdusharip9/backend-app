const BaseError = require('../errors/base.error')
const usersModel = require('../models/users.model')
const bcrypt = require('bcrypt')
const UserDto = require('../dtos/user.dto')
const tokenService = require('./token.service')
const emailService = require('../services/email.service')

class AuthService {
	async register(email, password) {
		const existUser = await usersModel.findOne({ email })

		if (existUser) {
			throw BaseError.BadRequest(`User ${email} is alredy exist`)
		}

		const hashPassword = await bcrypt.hash(password, 10)
		const user = await usersModel.create({ email, password: hashPassword })

		// const activatedToken = tokenService.activationToken({ ...UserDto })

		// const activationLink = `${process.env.CLIENT_URL}/activate.html?token=${activatedToken}`

		// await emailService.sendMail(user.email, activationLink)
		const userDto = new UserDto(user)

		return { user: userDto }
	}

	async login(email, password) {
		const user = await usersModel.findOne({ email })
		console.log(user, email)

		if (!user) {
			throw BaseError.BadRequest('User is not found or alredy exist')
		}

		const isPassword = await bcrypt.compare(password, user.password)
		if (!isPassword) {
			throw BaseError.BadRequest('Password is incorrect')
		}

		const userDto = new UserDto(user)
		return { user: userDto }
	}
}

module.exports = new AuthService()

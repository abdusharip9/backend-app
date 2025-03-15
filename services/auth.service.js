const BaseError = require('../errors/base.error')
const usersModel = require('../models/users.model')
const bcrypt = require('bcrypt')
const UserDto = require('../dtos/user.dto')
const tokenService = require('./token.service')

class AuthService {
	async register(email, password) {
		const existUser = await usersModel.findOne({ email })

		if (existUser) {
			throw BaseError.BadRequest(`User ${email} is alredy exist`)
		}

		const hashPassword = await bcrypt.hash(password, 10)
		const user = await usersModel.create({ email, password: hashPassword })

		const userDto = new UserDto(user)
		const tokens = tokenService.generateToken({ ...UserDto })

		await tokenService.saveToken(userDto.id, tokens.refreshToken)

		return { user: userDto, ...tokens }
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

		const tokens = tokenService.generateToken({ ...userDto })
		await tokenService.saveToken(userDto.id, tokens.refreshToken)

		return { user: userDto, ...tokens }
	}

	async logout(refreshToken) {
		return await tokenService.removeToken(refreshToken)
	}

	async refresh(refreshToken) {
		if (!refreshToken) {
			throw BaseError.UnAuthorizedError('Bad authorization')
		}

		const userPayload = tokenService.validateRefreshToken(refreshToken)
		const tokenDb = await tokenService.findToken(refreshToken)
		console.log(userPayload, tokenDb)

		if (!userPayload || !tokenDb) {
			throw BaseError.UnAuthorizedError('Bad authorization')
		}

		const user = await usersModel.findById(userPayload.id)
		const userDto = new UserDto(user)

		const tokens = tokenService.generateToken({ ...userDto })

		await tokenService.saveToken(userDto.id, tokens.refreshToken)

		return { user: userDto, ...tokens }
	}

	async getUser(email) {
		return await usersModel.findOne({ email })
	}

	async updateUser(post, id) {
		console.log(post)

		if (!id) {
			throw new Error('Id not found!')
		}

		const user = await usersModel.findByIdAndUpdate(
			id,
			{
				$set: post,
			},
			{ new: true }
		)

		const userDto = new UserDto(user)

		return { user: userDto }
	}
}

module.exports = new AuthService()

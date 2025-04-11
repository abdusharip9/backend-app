const BaseError = require('../errors/base.error')
const usersModel = require('../models/users.model')
const bcrypt = require('bcrypt')
const UserDto = require('../dtos/user.dto')
const tokenService = require('./token.service')
const emailService = require('./email.service')

class AuthService {
	async register(email, password, firstName, lastName, phone ) {
		const existUser = await usersModel.findOne({ email })
		const existPhone = await usersModel.findOne({ phone })

		if (existUser && existUser.isActivated === true) {
			throw BaseError.BadRequest(`Foydalanuvchi ${email} allaqachon mavjud.`)
		}
		if (existPhone && existPhone.isActivated === true) {
			throw BaseError.BadRequest(`Telefon raqam ${phone} allaqachon mavjud.`)
		}

		// const hashPassword = await bcrypt.hash(password, 10)
		const verificationCode = Math.floor(1000 + Math.random() * 9000).toString()

		if (existUser && existUser.isActivated === false) {
			existUser.password = password
			existUser.verificationCode = verificationCode
			await existUser.save()
		} else {
			await usersModel.create({
				email,
				password: password,
				firstName: firstName,
				lastName: lastName,
				phone: phone,
				verificationCode: verificationCode,
			})
		}

		await emailService.sendMail(email, verificationCode)

		return { message: 'Verification code sent!' }
	}

	async verifyCode(email, code) {
		const user = await usersModel.findOne({ email })
		if (!user) {
			throw BaseError.BadRequest(`User ${email} not found`)
		}

		if (user.verificationCode == code) {
			user.verificationCode = null
			user.isActivated = true
			user.save()

			const userDto = new UserDto(user)
			const tokens = tokenService.generateToken({ ...UserDto })
			await tokenService.saveToken(userDto.id, tokens.refreshToken)
			return {
				user: userDto,
				message: 'Email verified successfully!',
				status: 200,
				...tokens,
			}
		} else {
			throw BaseError.BadRequest('Kod mos kelmadi!')
		}
	}

	async login(email, password) {
		const user = await usersModel.findOne({ email })
		console.log(user, email)

		if (!user) {
			throw BaseError.BadRequest('User is not found or alredy exist')
		}

		// const isPassword = await bcrypt.compare(password, user.password)
		if (password !== user.password) {
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
}

module.exports = new AuthService()

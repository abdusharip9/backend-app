const BaseError = require('../errors/base.error')
const usersModel = require('../models/users.model')
const cafeModel = require('../models/cafes.model')
const tariffModel = require('../models/tariffs.model')
const bcrypt = require('bcrypt')
const UserDto = require('../dtos/user.dto')
const tokenService = require('./token.service')
const emailService = require('./email.service')


class AuthService {
	async register(email, password, firstName, lastName, phone, kafeName ) {
		const existUser = await usersModel.findOne({ email })
		const existPhone = await usersModel.findOne({ phone })
		const existKafe = await cafeModel.findOne({ name: kafeName })

		if (existUser && existUser.isActivated === true) {
			throw BaseError.BadRequest(`Foydalanuvchi ${email} allaqachon mavjud.`)
		}
		if (existPhone && existPhone.isActivated === true) {
			throw BaseError.BadRequest(`Telefon raqam ${phone} allaqachon mavjud.`)
		}
		if (existKafe && existKafe.isActivated === true) {
			throw BaseError.BadRequest(`Kafe nomi ${phone} allaqachon mavjud.`)
		}

		// const hashPassword = await bcrypt.hash(password, 10)
		const verificationCode = Math.floor(1000 + Math.random() * 9000).toString()
		
		if (existUser && existUser.isActivated === false) {
			existUser.password = password
			existUser.verificationCode = verificationCode
			await existUser.save()
		} else {
			const newUser = await usersModel.create({
				email,
				password,
				firstName,
				lastName,
				phone,
				verificationCode,
				role: 'user'
			})
			const newKafe = await cafeModel.create({
				name: kafeName,
				owner: newUser._id,
			})
			newUser.cafes.push(newKafe._id)
			await newUser.save()
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

		if (!user) {
			throw BaseError.BadRequest('Foydalanuvchi topilmadi yoki Email xato')
		}

		// const isPassword = await bcrypt.compare(password, user.password)
		if (password !== user.password) {
			// throw BaseError.BadRequest('Parol xato')
			throw BaseError.BadRequest('Foydalanuvchi topilmadi yoki Email xato')
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
			throw BaseError.UnAuthorizedError('Avtorizatsiya xatoligi')
		}

		const userPayload = tokenService.validateRefreshToken(refreshToken)
		const tokenDb = await tokenService.findToken(refreshToken)
		console.log(userPayload, tokenDb)

		if (!userPayload || !tokenDb) {
			throw BaseError.UnAuthorizedError('Avtorizatsiya xatoligi')
		}

		const user = await usersModel.findById(userPayload.id)
		const userDto = new UserDto(user)

		const tokens = tokenService.generateToken({ ...userDto })

		await tokenService.saveToken(userDto.id, tokens.refreshToken)

		return { user: userDto, ...tokens }
	}

	async forgotPassword(email) {
		if (!email) {
			throw BaseError.BadRequest('Email manzilini kiriting')
		}
		
		const user = await usersModel.findOne({ email })
		if (!user) {
			throw BaseError.BadRequest('Foydalanuvchi topilmadi')
		}
		
		const userDto = new UserDto(user)
		const tokens = tokenService.generateToken({ ...userDto })
		
		await emailService.sendForgotPasswordMail(email, `${process.env.CLIENT_URL}/new-password.html?token=${tokens.accessToken}`)
	}

	async recoveryAccount(token, password) {
		if (!token) {
			throw BaseError.BadRequest('Token topilmadi')
		}		

		if (!password) {
			throw BaseError.BadRequest('Parol kiriting')
		}
		
		const userData = tokenService.validateAccessToken(token)
		if (!userData) {
			throw BaseError.BadRequest('Token xato')
		}

		// const passwordHash = await bcrypt.hash(password, 10)
		const user = await usersModel.findByIdAndUpdate(userData.id, { password: password })
		console.log(user)

		return 200
	}
}

module.exports = new AuthService()

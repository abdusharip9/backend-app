const BaseError = require('../errors/base.error')
const usersModel = require('../models/users.model')
const bcrypt = require('bcrypt')
const UserDto = require('../dtos/user.dto')
const tokenService = require('./token.service')
const kafeModel = require('../models/kafe.model')
const emailService = require('./email.service')

class AuthService {
	async register(email, password) {
		const existUser = await usersModel.findOne({ email })

		if (existUser) {
			throw BaseError.BadRequest(`User ${email} is alredy exist`)
		}

		const hashPassword = await bcrypt.hash(password, 10)
		const verificationCode = Math.floor(1000 + Math.random() * 9000).toString()

		const user = await usersModel.create({
			email,
			password: hashPassword,
			verificationCode: verificationCode,
		})

		emailService.sendMail(email, verificationCode)

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
			return { message: 'Invalid code', status: 404 }
		}
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

	async getUser(id) {
		if (!id) {
			throw new Error('Id not found!')
		}

		const user = await usersModel.findById(id)
		const userKafe = await kafeModel.findById(id)
		let userDto = null
		if (userKafe && userKafe.name) {
			userDto = new UserDto(user, userKafe.name)
		} else userDto = new UserDto(user)
		return { userDto }
	}

	async updateUser(post, id) {
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

	async addKafe(post, id) {
		if (!id) {
			throw new Error('Id not found!')
		}

		const newKafeName = post.kafeName
		if (!newKafeName) {
			throw new Error('Kafe nomi bo‘sh bo‘lishi mumkin emas')
		}

		const existKafe = await kafeModel.findOne({ name: newKafeName })

		if (existKafe) {
			throw BaseError.BadRequest(`${newKafeName} nom oldindan mavjud`)
		}

		const updatedKafe = await kafeModel.findOneAndUpdate(
			{ _id: id },
			{ $addToSet: { name: newKafeName } },
			{ new: true, upsert: true }
		)

		return {
			kafes: updatedKafe.name,
			message: 'Malumotlar yangilandi',
		}
	}

	async deleteKafe(post, id) {
		if (!id) {
			throw new Error('Id not found!')
		}

		const changedUserData = await kafeModel.findByIdAndUpdate(
			id,
			{ $pull: { name: post.kafeName } },
			{ new: true }
		)

		if (!changedUserData) {
			throw BaseError.BadRequest(`${post.kafeName} topilmadi`)
		}
		return {
			updatedUser: changedUserData,
			message: `${post.kafeName} - Olib tashlandi`,
		}
	}
	// async editKafe(post, id) {
	// 	if (!id) {
	// 		throw new Error('Id not found!')
	// 	}

	// 	const newKafeName = post.kafeName
	// 	if (!newKafeName) {
	// 		throw new Error('Kafe nomi bo‘sh bo‘lishi mumkin emas')
	// 	}
	// 	const existKafe = await kafeModel.findOne({ name: newKafeName })
	// 	if (existKafe) {
	// 		throw BaseError.BadRequest(`${newKafeName} nom oldindan mavjud`)
	// 	}

	// 	const editedKafe = await kafeModel.findByIdAndUpdate(
	// 		id,
	// 		{ name: post.kafeName },
	// 		{ new: true }
	// 	)

	// 	return {
	// 		updatedUser: editedKafe,
	// 		message: `Kafe nomi o'zgartirildi => ${post.kafeName}`,
	// 	}
	// }

	async addPhone(post, id) {
		if (!id) {
			throw new Error('Id not found!')
		}

		const newPhone = post.phone
		if (!newPhone) {
			throw new Error('Telefon raqami bo‘sh bo‘lishi mumkin emas')
		}

		const existPhone = await usersModel.findOne({ phone: newPhone })

		if (existPhone) {
			throw BaseError.BadRequest(`${newPhone} raqam oldindan mavjud`)
		}

		const updatedUser = await usersModel.findOneAndUpdate(
			{ _id: id },
			{ $addToSet: { phone: newPhone } },
			{ new: true, upsert: true }
		)

		return {
			phones: updatedUser.phone,
			message: 'Ma’lumotlar yangilandi',
		}
	}
	async deletePhone(post, id) {
		if (!id) {
			throw new Error('Id not found!')
		}

		const newPhone = post.phone
		if (!newPhone) {
			throw new Error('Telefon raqami bo‘sh bo‘lishi mumkin emas')
		}

		const updatedUser = await usersModel.findByIdAndUpdate(
			{ _id: id },
			{ $pull: { phone: newPhone } },
			{ new: true, upsert: true }
		)

		if (!updatedUser) {
			throw BaseError.BadRequest(`${post.phone} topilmadi`)
		}

		return {
			phones: updatedUser.phone,
			message: `${post.phone} - Olib tashlandi`,
		}
	}
}

module.exports = new AuthService()

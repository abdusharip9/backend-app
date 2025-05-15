const BaseError = require('../errors/base.error')
const UserDto = require('../dtos/user.dto')
const tokenService = require('./token.service')
const usersModel = require('../models/users.model')

class AdminService {
	async login(email, password) {
		const user = await usersModel.findOne({ email, role: 'admin' })

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
}

module.exports = new AdminService()

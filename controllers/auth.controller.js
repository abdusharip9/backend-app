const authService = require('../services/auth.service')

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
			res.cookie('refreshToken', data.refreshToken, {
				httpOnly: true,
				maxAge: 30 * 24 * 60 * 60 * 1000,
				// secure: true,
				// sameSite: 'None',
			})
			return res.json({ data })
		} catch (error) {
			next(error)
		}
	}

	async logout(req, res, next) {
		try {
			const { refreshToken } = req.cookies
			await authService.logout(refreshToken)
			res.clearCookie('refreshToken')
			res.json({ message: 'Logged out successfully' })
		} catch (error) {
			next(error)
		}
	}

	async refresh(req, res, next) {
		try {
			const { refreshToken } = req.cookies
			const data = await authService.refresh(refreshToken)
			res.cookie('refreshToken', data.refreshToken, {
				httpOnly: true,
				maxAge: 30 * 24 * 60 * 60 * 1000,
			})
			return res.json(data)
		} catch (error) {
			next(error)
		}
	}

	async getUser(req, res, next) {
		try {
			const { id } = req.params
			const userData = await authService.getUser(id)
			return res.json(userData)
		} catch (error) {
			next(error)
		}
	}

	async updateUser(req, res, next) {
		try {
			const { body, params } = req
			await authService.updateUser(body, params.id)
			return res.json({ message: 'Malumolar yangilandi' })
		} catch (error) {
			next(error)
		}
	}
}

module.exports = new AuthController()

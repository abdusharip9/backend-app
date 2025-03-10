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
			})
			return res.json(data)
		} catch (error) {
			next(error)
		}
	}

	async logout(req, res, next) {
		try {
			const { refreshToken } = req.cookies
			const token = await authService.logout(refreshToken)
			res.clearCookies('refreshToken')
			return res.json({ token })
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
}

module.exports = new AuthController()

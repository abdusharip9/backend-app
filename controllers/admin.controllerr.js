const adminService = require('../services/admin.service')

class AdminController {
	async login(req, res, next) {
		try {
			const { email, password } = req.body
			const data = await adminService.login(email, password)
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

	register(req, res, next) {
		res.render('admin/register')
	}

}

module.exports = new AdminController()
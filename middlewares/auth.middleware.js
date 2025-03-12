const BaseError = require('../errors/base.error')
const tokenService = require('../services/token.service')

module.exports = function (req, res, next) {
	try {
		const authorization = req.headers.authorization
		console.log(authorization)

		if (!authorization) {
			return next(BaseError.UnAuthorizedError())
		}

		const accessToken = authorization.split(' ')[1]
		console.log(accessToken)

		if (!accessToken) {
			return next(BaseError.UnAuthorizedError())
		}

		const userData = tokenService.validateAccessToken(accessToken)
		console.log(userData)
		if (!userData) {
			return next(BaseError.UnAuthorizedError())
		}

		req.user = userData

		next()
	} catch (error) {
		return next(BaseError.UnAuthorizedError())
	}
}

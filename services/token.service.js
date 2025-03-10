const jwt = require('jsonwebtoken')
const tokenModel = require('../models/token.model')

class TokenService {
	activationToken(payload) {
		const activationToken = jwt.sign(payload, process.env.JWT_ACCESS_KEY, {
			expiresIn: '2m',
		})
		return activationToken
	}
}

module.exports = new TokenService()

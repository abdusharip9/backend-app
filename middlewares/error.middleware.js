const BaseError = require('../errors/base.error')

module.exports = function (err, req, res, next) {
	if (err instanceof BaseError) {
		return res
			.status(err.status)
			.json({ message: err.message, errors: err.errors })
	}
	// console.log(err)
	console.log(err)

	return res.status(500).json({ message: 'Server error' })
}

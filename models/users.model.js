const { Schema, model } = require('mongoose')

const UserSchema = new Schema(
	{
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		firstName: { type: String, required: false },
		lastName: { type: String, required: false },
		phone: { type: String, required: false },
		adress: { type: String, required: true, unique: true },
		kafeName: { type: String, required: false },
		isActivated: { type: Boolean, default: false },
	},
	{ timestamps: true }
)

module.exports = model('User', UserSchema)

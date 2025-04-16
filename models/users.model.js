const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const UserSchema = new Schema(
	{
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		firstName: { type: String, required: false },
		lastName: { type: String, required: false },
		phone: { type: String, required: false },
		role: { type: String, enum: ['admin', 'user'], default: 'user' },
		cafes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cafe' }],
		isActivated: { type: Boolean, default: false },
		verificationCode: { type: Number, default: null },
	},
	{ timestamps: true }
)

module.exports = model('User', UserSchema)
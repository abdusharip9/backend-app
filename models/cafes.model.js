const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// CAFE
const cafeSchema = new mongoose.Schema({
	name: { type: String, required: true },
	owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	status: { type: String, enum: ['active', 'inactive', 'banned'], default: 'inactive' },
	balance: { type: Number, default: 0 },
	tariff: { type: mongoose.Schema.Types.ObjectId, ref: 'Tariff' }
}, { timestamps: true });

module.exports = model('Cafe', cafeSchema)

const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// PAYMENT
const paymentSchema = new mongoose.Schema({
	cafeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cafe', required: true },
	amount: { type: Number, required: true },
	type: { type: String, enum: ['income', 'expense'], required: true },
	method: { type: String, enum: ['click', 'payme', 'manual'], required: true },
	status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
	createdAt: { type: Date, default: Date.now }
});


module.exports = model('Payment', paymentSchema)

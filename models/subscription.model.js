const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// SUBSCRIPTION
const subscriptionSchema = new mongoose.Schema({
	cafeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cafe', required: true },
	tariffId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tariff', required: true },
	startDate: { type: Date, required: true },
	endDate: { type: Date, required: true },
	isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = model('Subscription', subscriptionSchema)

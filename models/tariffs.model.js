const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// TARIFF
const tariffSchema = new mongoose.Schema({
	name: { type: String, required: true },
	price: { type: Number, required: true },
	durationInDays: { type: Number, required: true },
	features: [{ type: String }]
}, { timestamps: true });

module.exports = model('Tariff', tariffSchema)

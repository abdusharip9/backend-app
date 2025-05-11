const mongoose = require('mongoose');

const TariffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: String, enum: ['daily', 'monthly', 'yearly'], required: true },
  duration_count: { type: Number, required: true },
  is_free_trial: { type: Boolean, default: false },
  features: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Feature' }],
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Tariff', TariffSchema);

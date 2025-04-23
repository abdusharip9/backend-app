const mongoose = require('mongoose');

const TariffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  durations: {
    daily: {
      duration: { type: Number },
      price: { type: Number }
    },
    monthly: {
      duration: { type: Number },
      price: { type: Number }
    },
    yearly: {
      duration: { type: Number },
      price: { type: Number }
    }
  },
  is_free_trial: { type: Boolean, default: false },
  features: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Feature' }]
}, { timestamps: true });

module.exports = mongoose.model('Tariff', TariffSchema);

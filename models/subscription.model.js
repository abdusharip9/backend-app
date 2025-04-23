const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  tariff_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Tariff', required: true },
  payment_type: { type: String, enum: ['monthly', 'yearly', 'daily'], required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date },
  status: { type: String, enum: ['active', 'expired', 'cancelled'], default: 'active' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);

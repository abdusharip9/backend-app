const { Schema, model } = require('mongoose');

const KafeUser = new Schema({
  kafeId: { type: Schema.ObjectId, ref: 'Kafe', required: true },
  username: { type: String, required: true },
  password: { type: String, required: true }
});

KafeUser.index({ kafeId: 1, username: 1 }, { unique: true });

module.exports = model('KafeUser', KafeUser);

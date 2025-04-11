const { Schema, model, Types } = require('mongoose');

const KafeSchema = new Schema({
	adminId: { type: Schema.ObjectId, ref: 'User', required: true },
	kafes: [
		{
			_id: { type: Schema.ObjectId, default: () => new Types.ObjectId() },
			name: { type: String, required: true }
		}
	]
});

module.exports = model('Kafe', KafeSchema);

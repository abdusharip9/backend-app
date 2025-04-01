const { Schema, model } = require('mongoose')

const KafeSchema = new Schema({
	id: { type: Schema.ObjectId, ref: 'User' },
	name: { type: [String], required: false, default: [] },
})

module.exports = model('Kafe', KafeSchema)

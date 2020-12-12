const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	mail: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	isShopkeeper: {
		type: Boolean,
		required: true,
	},
	Queue: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
});

const User = mongoose.model('User', UserSchema);
module.exports = User;

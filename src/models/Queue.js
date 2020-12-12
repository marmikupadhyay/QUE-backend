const mongoose = require('mongoose');

const QueueSchema = new mongoose.Schema({
	current: [mongoose.Types.ObjectId],
});

const Queue = mongoose.model('Queue', QueueSchema);
module.exports = Queue;

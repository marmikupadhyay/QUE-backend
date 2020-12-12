const QueueController = {
	getQueueFront(req, res, next) {
		res.status(200).json({
			message: 'Front Queue Route',
			data: { sheetname: 'xyz' },
		});
	},
	enqueue(req, res, next) {
		res.status(200).json({
			message: 'Enqueue Done Succesfully',
			data: { sheetname: 'xyz' },
		});
	},
	leave(req, res, next) {
		res.status(200).json({
			message: 'User Removed Succesfully',
			data: { sheetname: 'xyz' },
		});
	},
	getPosition(req, res, next) {
		res.status(200).json({
			message: 'Position Route',
			data: { sheetname: 'xyz' },
		});
	},
};

module.exports = QueueController;

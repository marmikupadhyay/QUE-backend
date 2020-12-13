const Queue = require('../../models/Queue');
const User = require('../../models/User');
const ObjectId = require('mongoose').Types.ObjectId;

const QueueController = {
	getQueueFront(req, res, next) {
		Queue.findOne({ _id: req.params.queue_id })
			.then((queue) => {
				if (!queue) {
					``;
					res.status(400).json({
						message: 'Queue Not Found ',
						data: {},
					});
				} else {
					console.log(queue.current[0]);
					User.findOne({ _id: queue.current[0] })
						.then((user) => {
							if (!user) {
								res.status(404).json({
									message: 'Queue is empty ',
									data: {},
								});
							} else {
								res.status(200).json({
									message:
										'Front of Queue fetched successfully ',
									data: user,
								});
							}
						})
						.catch((err) => {
							console.log(err);
							res.status(500).json({
								message: 'Internal Server Error',
								error: err,
							});
						});
				}
			})
			.catch((err) => {
				console.log(err);
				res.status(500).json({
					message: 'Internal Server Error',
					error: err,
				});
			});
	},
	enqueue(req, res, next) {
		if (
			!ObjectId.isValid(req.params.user_id) ||
			!ObjectId.isValid(req.params.queue_id)
		) {
			res.status(400).json({
				message: 'Give Valid ID',
				data: {},
			});
		}
		Queue.findOne({
			_id: req.params.queue_id,
		})
			.then((queue) => {
				if (!queue.current.includes(req.params.user_id)) {
					Queue.update(
						{ _id: req.params.queue_id },
						{ $push: { current: req.params.user_id } }
					)
						.then((queue) => {
							res.status(200).json({
								message: 'Enqueue Done Succesfully',
								data: queue.current,
							});
						})
						.catch((err) => {
							console.log(err);
							res.status(500).json({
								message: 'Internal Server Error',
								error: err,
							});
						});
				} else {
					res.status(400).json({
						message: 'User Already In Queue',
						data: {},
					});
				}
			})
			.catch((err) => {
				console.log(err);
				res.status(500).json({
					message: 'Internal Server Error',
					error: err,
				});
			});
	},
	leave(req, res, next) {
		if (
			!ObjectId.isValid(req.params.user_id) ||
			!ObjectId.isValid(req.params.queue_id)
		) {
			res.status(400).json({
				message: 'Give Valid ID',
				data: {},
			});
		}
		Queue.update(
			{ _id: req.params.queue_id },
			{ $pull: { current: req.params.user_id } }
		)
			.then((queue) => {
				res.status(200).json({
					message: 'User Left Succesfully',
					data: queue.current,
				});
			})
			.catch((err) => {
				console.log(err);
				res.status(500).json({
					message: 'Internal Server Error',
					error: err,
				});
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

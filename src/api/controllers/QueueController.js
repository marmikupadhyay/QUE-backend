const e = require('express');
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
	create(req, res, next) {
		User.findOne({ _id: req.params.user_id })
			.then((user) => {
				if (!user) {
					res.status(404).json({
						message: 'User Not Found',
						data: {},
					});
				} else {
					var newQueue;
					newQueue = new Queue();
					newQueue.save((err) => {
						if (err) {
							console.log(err);
						}
					});
					User.update(
						{ _id: req.params.user_id },
						{ $push: { queue: newQueue._id } }
					)
						.then((user) => {
							res.status(200).json({
								message: 'Queue Created Succesfully',
								data: newQueue,
							});
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
	delete(req, res, next) {
		Queue.findOneAndDelete({ _id: req.params.queue_id })
			.then((queue) => {
				if (!queue) {
					res.status(404).json({
						message: 'Queue Not Found',
						data: {},
					});
				} else {
					User.update(
						{ _id: req.params.user_id },
						{ $pull: { queue: req.params.queue_id } },
						(err) => {
							if (err) {
								res.status(500).json({
									message: 'Internal Server Error',
									error: err,
								});
							}
							res.status(200).json({
								message: 'Queue Removed Succesfully',
								data: queue,
							});
						}
					);
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
	getCount(req, res, next) {
		Queue.findOne({ _id: req.params.queue_id })
			.then((queue) => {
				res.status(200).json({
					message: 'Count Got Succesfully',
					data: { count: queue.current.length },
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
	getNames(req, res, next) {
		Queue.findOne({ _id: req.params.queue_id })
			.then((queue) => {
				if (!queue) {
					res.status(400).json({
						message: 'Queue Not Found',
						data: {},
					});
				} else {
					User.find({ _id: { $in: queue.current } })
						.then((users) => {
							console.log(users);
							let userNames = users.map((user) => {
								return user.name;
							});
							res.status(200).json({
								message: 'Names Fetched Successfully',
								data: userNames,
							});
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
};

module.exports = QueueController;

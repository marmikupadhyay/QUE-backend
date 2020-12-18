const e = require('express');
const Queue = require('../../models/Queue');
const User = require('../../models/User');
const ObjectId = require('mongoose').Types.ObjectId;

const getNewId = () => {
	const base62 = {
		charset: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(
			''
		),
		encode: (integer) => {
			if (integer === 0) {
				return 0;
			}
			let s = [];
			while (integer > 0) {
				s = [base62.charset[integer % 62], ...s];
				integer = Math.floor(integer / 62);
			}
			return s.join('');
		},
		decode: (chars) =>
			chars
				.split('')
				.reverse()
				.reduce(
					(prev, curr, i) =>
						prev + base62.charset.indexOf(curr) * 62 ** i,
					0
				),
	};

	let newId = base62.encode(
		Math.floor(Math.random() * 10000000000 + 1000000000)
	);
	return newId;
};

const createRecursion = (req, res, next, newId) => {
	Queue.findOne({ _id: newId }, (err, queue) => {
		if (err || queue) {
			createRecursion(req, res, next, getNewId());
		} else {
			var newQueue;
			newQueue = new Queue({ _id: newId });
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
	});
};

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
		Queue.findOne({ _id: req.params.queue_id })
			.then((queue) => {
				res.status(200).json({
					message: 'Count Got Succesfully',
					data: queue.current.indexOf(req.params.user_id),
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
	create(req, res, next) {
		User.findOne({ _id: req.params.user_id })
			.then((user) => {
				if (!user) {
					res.status(404).json({
						message: 'User Not Found',
						data: {},
					});
				} else {
					let newId = getNewId();
					createRecursion(req, res, next, newId);
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

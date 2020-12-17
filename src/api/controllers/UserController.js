const User = require('../../models/User');
const Queue = require('../../models/Queue');
const ObjectId = require('mongoose').Types.ObjectId;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserController = {
	getUserDetails(req, res, next) {
		if (!ObjectId.isValid(req.params.user_id)) {
			res.status(400).json({
				message: 'Give Valid User ID',
				data: {},
			});
		}
		User.findOne({ _id: req.params.user_id })
			.then((user) => {
				if (!user) {
					res.status(404).json({
						message: 'User Not Found',
						data: {},
					});
				} else {
					res.status(200).json({
						message: 'User Details Fetched Succesfully',
						data: user,
					});
				}
			})
			.catch((err) => {
				console.log(err);
				rres.status(500).json({
					message: 'Internal Server Error',
					error: err,
				});
			});
	},
	register(req, res, next) {
		var { name, mail, password, isShopkeeper } = req.body;
		if (!name || !mail || !password) {
			res.status(400).json({
				message: 'Please Fill All Fields',
				data: req.body,
			});
		}
		// isShopkeeper = isShopkeeper === 'false' ? false : true;
		var newQueue;
		if (isShopkeeper) {
			newQueue = new Queue();
			newQueue.save((err) => {
				if (err) {
					console.log(err);
				}
			});
		}
		const newUser = new User({
			name,
			mail,
			password,
			isShopkeeper,
			queue: isShopkeeper ? [newQueue._id] : [],
		});
		User.findOne({ mail: mail })
			.then((user) => {
				if (user) {
					res.status(400).json({
						message: 'Email Already Used!',
						data: req.body,
					});
				} else {
					//HASH PASSWORD
					bcrypt.genSalt(10, (err, salt) => {
						bcrypt.hash(newUser.password, salt, (err, hash) => {
							if (err) throw err;

							//Set the new hashed password
							newUser.password = hash;

							//Saving the use to DB
							newUser
								.save()
								.then((user) => {
									res.status(201).json({
										message: 'Account Made Succesfully',
										data: user,
									});
								})
								.catch((err) => {
									console.log(err);
									res.status(500).json({
										message: 'Internal Server Error',
										error: err,
									});
								});
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
	login(req, res, next) {
		const { mail, password } = req.body;
		if (!mail || !password) {
			res.status(400).json({
				message: 'Please Fill All Fields',
				data: req.body,
			});
		}
		User.findOne({ mail: mail }).then((user) => {
			if (!user) {
				res.status(401).json({
					message: 'Invalid Credentials',
					data: {},
				});
			} else {
				//If Found check password
				bcrypt.compare(password, user.password, (err, isMatch) => {
					if (isMatch) {
						jwt.sign(
							{ user: user },
							'iosyeknet srerercesase',
							(err, token) => {
								//Password Matches , user returned
								res.status(200).json({
									message: 'Logged in Succesully',
									data: user,
									token: token,
								});
							}
						);
					} else {
						//Password dosen't match
						res.status(401).json({
							message: 'Invalid Credentials',
							data: {},
						});
					}
				});
			}
		}).catch;
	},
};

module.exports = UserController;

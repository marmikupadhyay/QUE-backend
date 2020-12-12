const User = require('../../models/User');
const Queue = require('../../models/Queue');
const ObjectId = require('mongoose').Types.ObjectId;

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
		const newQueue = new Queue();
		newQueue.save((err) => {
			if (err) {
				console.log(err);
			}
		});
		if (!name || !mail || !password) {
			res.status(400).json({
				message: 'Please Fill All Fields',
				data: req.body,
			});
		}
		isShopkeeper = isShopkeeper === 'false' ? false : true;
		const newUser = new User({
			name,
			mail,
			password,
			isShopkeeper,
			queue: isShopkeeper ? newQueue._id : null,
		});
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
	},
	login(req, res, next) {
		res.status(200).json({
			message: 'Login Route',
			data: { username: 'xyz' },
		});
	},
};

module.exports = UserController;

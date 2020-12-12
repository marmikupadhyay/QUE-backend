const UserController = {
	getUserDetails(req, res, next) {
		res.status(200).json({
			message: 'User Details Fetched Succesfully',
			data: { username: 'xyz' },
		});
	},
	register(req, res, next) {
		res.status(200).json({
			message: 'Register Route',
			data: { username: 'xyz' },
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

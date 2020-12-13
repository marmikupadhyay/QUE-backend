const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
	const bearerHeader = req.headers['authorization'];
	if (typeof bearerHeader !== 'undefined') {
		const bearer = bearerHeader.split(' ');
		const bearerToken = bearer[1];
		req.token = bearerToken;
		jwt.verify(req.token, 'iosyeknet srerercesase', (err, authData) => {
			if (err) {
				res.status(403).json({
					message: 'Not Authorized',
					data: {},
				});
			} else {
				next();
			}
		});
	} else {
		res.status(403).json({
			message: 'Not Authorized',
			data: {},
		});
	}
};
module.exports.verifyToken = verifyToken;

const express = require('express');
const router = express.Router();
const QueueController = require('../controllers/QueueController');
const { verifyToken } = require('../middlewares/AuthMiddleWare');

router.get('/:queue_id/front', verifyToken, QueueController.getQueueFront);
router.get('/:queue_id/enqueue/:user_id', verifyToken, QueueController.enqueue);
router.get('/:queue_id/leave/:user_id', verifyToken, QueueController.leave);
router.get(
	'/:queue_id/position/:user_id',
	verifyToken,
	QueueController.getPosition
);
// New Routes
router.post('/create/:user_id', verifyToken, QueueController.create);
router.delete(
	'/:queue_id/delete/:user_id',
	verifyToken,
	QueueController.delete
);
router.get('/:queue_id/count/', verifyToken, QueueController.getCount);
router.get('/:queue_id/getNames/', verifyToken, QueueController.getNames);

module.exports = router;

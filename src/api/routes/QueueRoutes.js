const express = require('express');
const router = express.Router();
const QueueController = require('../controllers/QueueController');
const { verifyToken } = require('../middlewares/AuthMiddleWare');

router.get('/:queue_id/front', verifyToken, QueueController.getQueueFront);
router.get('/:queue_id/enqueue/:user_id', verifyToken, QueueController.enqueue);
router.get('/:queue_id/leave/:user_id', verifyToken, QueueController.leave);
router.get('/:queue_id/position/:id', verifyToken, QueueController.getPosition);
module.exports = router;

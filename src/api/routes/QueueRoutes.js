const express = require('express');
const router = express.Router();
const QueueController = require('../controllers/QueueController');

router.get('/:queue_id/front', QueueController.getQueueFront);
router.get('/:queue_id/enqueue/:user_id', QueueController.enqueue);
router.get('/:queue_id/leave/:user_id', QueueController.leave);
router.get('/:queue_id/position/:id', QueueController.getPosition);
module.exports = router;

const express = require('express');
const { getNotifications, updateIsReadStatus } = require('../controllers/NotificationController');

const router = express.Router();

router.get('/getNotifications', getNotifications);
router.patch('/updateIsReadStatus', updateIsReadStatus)

module.exports = router; 
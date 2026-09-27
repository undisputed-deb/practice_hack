const express = require('express');
const { getActiveAlerts, resolveAlert } = require('../controllers/alertController');

const router = express.Router();

router.get('/active', getActiveAlerts);
router.post('/resolve/:alert_id', resolveAlert);

module.exports = router;

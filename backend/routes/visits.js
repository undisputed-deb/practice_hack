const express = require('express');
const { checkin, checkout, getActiveVisits, getStaffHistory } = require('../controllers/visitController');

const router = express.Router();

router.post('/checkin', checkin);
router.post('/checkout', checkout);
router.get('/active', getActiveVisits);
router.get('/history/:staff_id', getStaffHistory);

module.exports = router;

const express = require('express');
const { getClients, getClientById, createClient } = require('../controllers/clientController');

const router = express.Router();

router.get('/', getClients);
router.get('/:id', getClientById);
router.post('/', createClient);

module.exports = router;

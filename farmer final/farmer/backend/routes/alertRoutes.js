const express = require('express');
const router = express.Router();
const { getAlerts, createAlert, markAlertsRead, deleteAlert, hideAlert } = require('../controllers/alertController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getAlerts);
router.post('/', [authMiddleware, adminMiddleware], createAlert);
router.put('/read', authMiddleware, markAlertsRead);
router.put('/:id/hide', authMiddleware, hideAlert);
router.delete('/:id', [authMiddleware, adminMiddleware], deleteAlert);

module.exports = router;

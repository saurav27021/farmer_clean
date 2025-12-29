const express = require('express');
const router = express.Router();
const { createReport, getReports, deleteReport, resolveReport } = require('../controllers/reportController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/', authMiddleware, createReport);
router.get('/', authMiddleware, getReports);
router.put('/:id/resolve', authMiddleware, resolveReport);
router.delete('/:id', authMiddleware, deleteReport);

module.exports = router;

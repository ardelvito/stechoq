// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authorController');
const authMiddleware = require('../middleware/authMiddleware');
const authAdmin = require('../middleware/authAdmin');

router.post('/create', [authMiddleware, authAdmin], authorController.create);

router.patch('/edit/:id', [authMiddleware, authAdmin], authorController.edit);

router.delete('/delete/:id', [authMiddleware, authAdmin], authorController.delete);

// router.get('/detail', authMiddleware, authController.detail);

module.exports = router;

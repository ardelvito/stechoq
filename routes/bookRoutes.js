const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const authMiddleware = require('../middleware/authMiddleware');
const authAdmin = require('../middleware/authAdmin');

router.post('/create', [authMiddleware, authAdmin], bookController.create);

router.patch('/edit/:id', [authMiddleware, authAdmin], bookController.edit);

router.delete('/delete/:id', [authMiddleware, authAdmin], bookController.delete);

router.get('/', [authMiddleware], bookController.getAllBook);

module.exports = router;
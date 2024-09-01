const express = require('express');
const authController = require('../controllers/authController');
const urlController = require('../controllers/urlController');
const authMiddleware = require('../middlewares/authMiddleware');
const crypto = require('crypto');

const router = express.Router();

// Rotas de Autenticação
router.post('/register', authController.register);
router.post('/login', authController.login);

// rotas de URL
router.post('/shorten', urlController.shorten);
router.get('/urls', authMiddleware, urlController.listUrls);
router.put('/urls/:id', authMiddleware, urlController.updateUrl);
router.delete('/urls/:id', authMiddleware, urlController.deleteUrl);

// Redirecionamento de URL encurtada
router.get('/redirect/:shortUrl', urlController.redirectUtl);

module.exports = router;
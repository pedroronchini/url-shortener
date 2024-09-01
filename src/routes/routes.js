const express = require('express');
const authController = require('../controllers/authController');
const urlController = require('../controllers/urlController');
const authMiddleware = require('../middlewares/authMiddleware');
const crypto = require('crypto');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: Email do usuário
 *         password:
 *           type: string
 *           description: Senha do usuário
 */

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Rotas de autenticação
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Registra um novo usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Usuário registrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   description: Token JWT gerado para o usuário
 *       400:
 *         description: Falha ao registrar o usuário
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Autentica um usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT gerado para o usuário
 *       400:
 *         description: Credenciais inválidas
 */
router.post('/login', authController.login);

/**
 * @swagger
 * components:
 *   schemas:
 *     Url:
 *       type: object
 *       required:
 *         - originalUrl
 *       properties:
 *         id:
 *           type: integer
 *           description: ID gerado automaticamente para a URL encurtada
 *         originalUrl:
 *           type: string
 *           description: URL original enviada para ser encurtada
 *         shortUrl:
 *           type: string
 *           description: URL encurtada gerada pelo sistema
 *         clicks:
 *           type: integer
 *           description: Número de vezes que a URL encurtada foi acessada
 *         userId:
 *           type: integer
 *           description: ID do usuário que criou a URL (nulo se for um usuário não autenticado)
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data e hora da última atualização
 *         deletedAt:
 *           type: string
 *           format: date-time
 *           description: Data e hora da exclusão lógica (nulo se não foi excluída)
 */

/**
 * @swagger
 * tags:
 *   name: URLs
 *   description: Rotas para gerenciamento de URLs encurtadas
 */

/**
 * @swagger
 * /shorten:
 *   post:
 *     summary: Encurta uma URL
 *     tags: [URLs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               originalUrl:
 *                 type: string
 *                 description: URL original que será encurtada
 *     responses:
 *       200:
 *         description: URL encurtada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Url'
 *       400:
 *         description: Erro ao tentar encurtar a URL
 */
router.post('/shorten', urlController.shorten);

/**
 * @swagger
 * /urls:
 *   get:
 *     summary: Lista todas as URLs encurtadas pelo usuário autenticado
 *     tags: [URLs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de URLs encurtadas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Url'
 *       401:
 *         description: Não autorizado
 */
router.get('/urls', authMiddleware, urlController.listUrls);

/**
 * @swagger
 * /urls/{id}:
 *   put:
 *     summary: Atualiza o endereço original de uma URL encurtada
 *     tags: [URLs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da URL a ser atualizada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               originalUrl:
 *                 type: string
 *                 description: Novo endereço original da URL
 *     responses:
 *       200:
 *         description: URL atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Url'
 *       400:
 *         description: Erro ao tentar atualizar a URL
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: URL não encontrada
 */
router.put('/urls/:id', authMiddleware, urlController.updateUrl);

/**
 * @swagger
 * /urls/{id}:
 *   delete:
 *     summary: Exclui logicamente uma URL encurtada
 *     tags: [URLs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da URL a ser excluída
 *     responses:
 *       204:
 *         description: URL excluída com sucesso (No Content)
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: URL não encontrada
 */
router.delete('/urls/:id', authMiddleware, urlController.deleteUrl);

/**
 * @swagger
 * /redirect/{shortUrl}:
 *   get:
 *     summary: Redireciona para o endereço original da URL encurtada e conta o clique
 *     tags: [URLs]
 *     parameters:
 *       - in: path
 *         name: shortUrl
 *         required: true
 *         schema:
 *           type: string
 *         description: URL curta gerada pelo sistema
 *     responses:
 *       301:
 *         description: Redireciona para a URL original
 *       404:
 *         description: URL encurtada não encontrada
 */
router.get('/redirect/:shortUrl', urlController.redirectUtl);

module.exports = router;
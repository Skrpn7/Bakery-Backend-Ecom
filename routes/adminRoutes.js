const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

/**
 * @swagger
 * tags:
 *   name: Admins
 *   description: Admin management
 */

/**
 * @swagger
 * /CreateUser:
 *   post:
 *     summary: Create a new admin
 *     tags: [Admins]
 *     responses:
 *       201:
 *         description: Admin created successfully
 */
router.post('/CreateUser', adminController.createUser);

/**
 * @swagger
 * /GetAllUsers:
 *   get:
 *     summary: Get all admins
 *     tags: [Admins]
 *     responses:
 *       200:
 *         description: A list of admins
 */
router.get('/GetUsers', adminController.getAdmins);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Admin login
 *     tags: [Admins]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful with JWT token
 */
router.post('/login', adminController.login);

module.exports = router;

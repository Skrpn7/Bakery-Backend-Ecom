const express = require('express');
const router = express.Router();
const imageController = require('../controllers/image.controller');
const authenticate = require('../middlewares/authenticate');

/**
 * @swagger
 * tags:
 *   name: Images
 *   description: Image management
 */

/**
 * @swagger
 * /images:
 *   get:
 *     summary: Get all images
 *     tags: [Images]
 *     responses:
 *       200:
 *         description: A list of images
 */
router.get('/',authenticate, imageController.getImages);

router.get('/:id', imageController.getImageById);

/**
 * @swagger
 * /images:
 *   post:
 *     summary: Create a new image
 *     tags: [Images]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ProductId:
 *                 type: integer
 *               isactive:
 *                 type: boolean
 *               isdeleted:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Image created successfully
 */
router.post('/', authenticate, imageController.createImage);

/**
 * @swagger
 * /images/{id}:
 *   put:
 *     summary: Update an image
 *     tags: [Images]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The image ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isactive:
 *                 type: boolean
 *               isdeleted:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Image updated successfully
 *       404:
 *         description: Image not found
 */
router.put('/:id', authenticate, imageController.updateImage);

/**
 * @swagger
 * /images/{id}:
 *   delete:
 *     summary: Delete an image
 *     tags: [Images]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The image ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *       404:
 *         description: Image not found
 */
router.delete('/:id',authenticate,  imageController.deleteImage);

module.exports = router;

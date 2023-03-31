import { Router } from 'express';
import { productsController } from '../controllers/productsController';
import { imageController } from '../controllers/imageController';
import { imageMiddleware } from '../middlewares/imageMiddleware';
import { authController } from '../controllers/authController';
import { isAdmin } from '../middlewares/isAdmin';
import asyncHandler from 'express-async-handler';

const router = Router();

/**
 * @swagger
 * /api/images/{id}:
 *   get:
 *     summary: Returns an array of images
 *     tags:
 *       - Images
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 61b6871a6238063410299fc5
 *     responses:
 *       200:
 *         description: Returns array of images
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 images:
 *                     $ref: '#/components/schemas/ImageArray'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *                  $ref: '#/components/schemas/400BadRequest'
 */
router.get('/:id', productsController.checkValidId, asyncHandler(imageController.getImages as any));

/**
 * @swagger
 * /api/images/upload/{id}:
 *   post:
 *     summary: Returns an array of images
 *     tags:
 *       - Images
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: header
 *         name: x-auth-token
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/x-auth-token'
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 61b6871a6238063410299fc5
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Returns array of images
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Image uploaded
 *                 data:
 *                   $ref: '#/components/schemas/ImageArray'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *                  $ref: '#/components/schemas/400BadRequest'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *                  $ref: '#/components/schemas/401Unauthorized'
 */
router.post(
  '/upload/:id',
  authController.checkUserAuth,
  isAdmin,
  productsController.checkValidId,
  imageMiddleware.upload.single('file'),
  asyncHandler(imageMiddleware.uploadImage as any),
  asyncHandler(imageController.uploadImage as any)
);

/**
 * @swagger
 * /api/images/:id:
 *   delete:
 *     summary: Returns an array of images
 *     tags:
 *       - Images
 *     parameters:
 *       - in: header
 *         name: x-auth-token
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/x-auth-token'
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 61b6871a6238063410299fc5
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                type: string
 *                example: https://res.cloudinary.com/caffeine-apps/image/upload/v1641240321/kujkgvuvpk31pv8xhqth.jpg
 *     responses:
 *       200:
 *         description: Returns Message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Image deleted
 *                 data:
 *                   $ref: '#/components/schemas/ImageArray'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *                  $ref: '#/components/schemas/400BadRequest'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *                  $ref: '#/components/schemas/401Unauthorized'
 */
router.delete(
  '/:id',
  authController.checkUserAuth,
  isAdmin,
  productsController.checkValidId,
  asyncHandler(imageMiddleware.deleteImage as any),
  asyncHandler(imageController.deleteImage as any),
  (req: any, res: any) => {
    res.status(200).json({
      msg: 'Imagen eliminada correctamente'
    });
  }
);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     ImageData:
 *       type: array
 *       items:
 *         type: url
 *         format: string
 *         example: https://res.cloudinary.com/caffeine-apps/image/upload/v1639966361/tefktngz6x5rdm6m4kui.jpg
 *     NewImageInput:
 *       type: formData
 *       properties:
 *         image:
 *           type: file
 *           description: Image to upload
 *           example: tefktngz6x5rdm6m4kui.jpg
 *     ImageArray:
 *       type: array
 *       items:
 *         type: url
 *         format: string
 *         example: https://res.cloudinary.com/caffeine-apps/image/upload/v1639966361/tefktngz6x5rdm6m4kui.jpg, https://res.cloudinary.com/caffeine-apps/image/upload/v1639966361/tefktngz6x5rdm6m4kui.jpg, https://res.cloudinary.com/caffeine-apps/image/upload/v1639966361/tefktngz6x5rdm6m4kui.jpg
 *     x-auth-token:
 *         type: string
 *         required: true
 *         description: JWT Bearer token
 *         example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MWI2OTM2MjI0NTRlOWUxZmY4ZTg4ZDciLCJ1c2VyTmFtZSI6IkFwdThraWRzIiwiZW1haWwiOiJhcHVAa3dpa2VtYXJ0LmNvbSIsImFkbWluIjp0cnVlLCJpYXQiOjE2NDEyMzU4NDQsImV4cCI6MjI3MjM4Nzg0NH0.j8TUEzUxvhHmVF35sJRdVxs-Oa7z2qNVs52ax8FylNI"
 */

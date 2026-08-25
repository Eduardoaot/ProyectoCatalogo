import { Router } from 'express';
import { body, param } from 'express-validator';
import { validate } from '../middlewares/validate.js';
import { auth } from '../middlewares/auth.js';
import {
  agregarFavorito,
  listarFavoritos,
  quitarFavorito,
} from '../controllers/favoritos.controller.js';

const router = Router();

// Los favoritos son siempre los del cliente del token.
router.use(auth);

router.get('/', listarFavoritos);

router.post(
  '/',
  body('ID_producto').isInt({ min: 1 }).withMessage('ID_producto debe ser un entero positivo'),
  validate,
  agregarFavorito,
);

router.delete(
  '/:idProducto',
  param('idProducto').isInt({ min: 1 }).withMessage('idProducto debe ser un entero positivo'),
  validate,
  quitarFavorito,
);

export default router;

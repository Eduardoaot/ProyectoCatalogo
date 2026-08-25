import { Router } from 'express';
import { body, param } from 'express-validator';
import { validate } from '../middlewares/validate.js';
import { auth } from '../middlewares/auth.js';
import { crearOrden, obtenerOrden } from '../controllers/ordenes.controller.js';

const router = Router();

// Todas las rutas de ordenes exigen token.
router.use(auth);

router.post(
  '/',
  [
    body('items').isArray({ min: 1 }).withMessage('items debe ser un arreglo con al menos un producto'),
    body('texto_codigo')
      .optional({ nullable: true, checkFalsy: true })
      .isString()
      .withMessage('texto_codigo debe ser texto')
      .bail()
      .trim()
      .isLength({ max: 50 })
      .withMessage('texto_codigo admite maximo 50 caracteres'),
    body('items.*.ID_producto').isInt({ min: 1 }).withMessage('Cada item necesita un ID_producto entero positivo'),
    body('items.*.cantidad')
      .isFloat({ gt: 0 })
      .withMessage('Cada item necesita una cantidad mayor a cero')
      .bail()
      .custom((valor) => {
        // cantidad_orden_producto es DECIMAL(10,3): maximo tres decimales.
        const decimales = String(valor).split('.')[1] ?? '';
        if (decimales.length > 3) throw new Error('cantidad admite maximo 3 decimales');
        return true;
      }),
  ],
  validate,
  crearOrden,
);

router.get(
  '/:id',
  param('id').isInt({ min: 1 }).withMessage('El id debe ser un entero positivo'),
  validate,
  obtenerOrden,
);

export default router;

import { Router } from 'express';
import { body, param } from 'express-validator';
import { validate } from '../middlewares/validate.js';
import { auth, mismoCliente } from '../middlewares/auth.js';
import {
  cambiarContrasena,
  login,
  perfil,
  registrar,
} from '../controllers/clientes.controller.js';
import { listarOrdenesDeCliente } from '../controllers/ordenes.controller.js';

const router = Router();

router.post(
  '/registro',
  [
    body('nombre_cliente').isString().withMessage('nombre_cliente debe ser texto').bail().trim().notEmpty().withMessage('nombre_cliente es obligatorio (maximo 150 caracteres)')
      .isLength({ max: 150 }).withMessage('nombre_cliente es obligatorio (maximo 150 caracteres)'),
    body('correo_cliente').isEmail().withMessage('correo_cliente debe ser un correo valido')
      .bail().trim().toLowerCase().isLength({ max: 255 }),
    body('contrasena_cliente').isString().withMessage('contrasena_cliente debe ser texto').bail().isLength({ min: 8, max: 72 })
      .withMessage('contrasena_cliente debe tener entre 8 y 72 caracteres'),
  ],
  validate,
  registrar,
);

router.post(
  '/login',
  [
    body('correo_cliente').isEmail().withMessage('correo_cliente debe ser un correo valido').bail().trim().toLowerCase(),
    body('contrasena_cliente').isString().withMessage('contrasena_cliente debe ser texto').bail().notEmpty().withMessage('contrasena_cliente es obligatoria'),
  ],
  validate,
  login,
);

router.get('/me', auth, perfil)

router.put(
  '/me/contrasena',
  auth,
  [
    body('contrasena_actual').isString().withMessage('contrasena_actual es obligatoria').bail()
      .notEmpty().withMessage('contrasena_actual es obligatoria'),
    body('contrasena_nueva').isString().withMessage('contrasena_nueva debe ser texto').bail()
      .isLength({ min: 8, max: 72 })
      .withMessage('La contraseña nueva debe tener entre 8 y 72 caracteres'),
  ],
  validate,
  cambiarContrasena,
);

router.get(
  '/:id/ordenes',
  auth,
  param('id').isInt({ min: 1 }).withMessage('El id debe ser un entero positivo'),
  validate,
  mismoCliente('id'),
  listarOrdenesDeCliente,
);

export default router;

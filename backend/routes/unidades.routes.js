import { Router } from 'express';
import { body, param } from 'express-validator';
import { validate } from '../middlewares/validate.js';
import {
  actualizarUnidad,
  crearUnidad,
  eliminarUnidad,
  listarUnidades,
  obtenerUnidad,
} from '../controllers/unidades.controller.js';

const router = Router();

const idValido = param('id').isInt({ min: 1 }).withMessage('El id debe ser un entero positivo');
const nombreValido = body('nombre_unidad')
  .isString()
  .withMessage('nombre_unidad debe ser texto')
  .bail()
  .trim()
  .notEmpty()
  .withMessage('nombre_unidad es obligatorio')
  .isLength({ max: 50 })
  .withMessage('nombre_unidad admite maximo 50 caracteres');

router.get('/', listarUnidades);
router.get('/:id', idValido, validate, obtenerUnidad);
router.post('/', nombreValido, validate, crearUnidad);
router.put('/:id', idValido, nombreValido, validate, actualizarUnidad);
router.delete('/:id', idValido, validate, eliminarUnidad);

export default router;

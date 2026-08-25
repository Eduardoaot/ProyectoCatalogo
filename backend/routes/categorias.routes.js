import { Router } from 'express';
import { body, param } from 'express-validator';
import { validate } from '../middlewares/validate.js';
import {
  actualizarCategoria,
  crearCategoria,
  eliminarCategoria,
  listarCategorias,
  obtenerCategoria,
} from '../controllers/categorias.controller.js';

const router = Router();

const idValido = param('id').isInt({ min: 1 }).withMessage('El id debe ser un entero positivo');
const nombreValido = body('nombre_categoria')
  .isString()
  .withMessage('nombre_categoria debe ser texto')
  .bail()
  .trim()
  .notEmpty()
  .withMessage('nombre_categoria es obligatorio')
  .isLength({ max: 100 })
  .withMessage('nombre_categoria admite maximo 100 caracteres');

router.get('/', listarCategorias);
router.get('/:id', idValido, validate, obtenerCategoria);
router.post('/', nombreValido, validate, crearCategoria);
router.put('/:id', idValido, nombreValido, validate, actualizarCategoria);
router.delete('/:id', idValido, validate, eliminarCategoria);

export default router;

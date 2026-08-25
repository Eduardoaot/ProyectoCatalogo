import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { validate } from '../middlewares/validate.js';
import {
  actualizarProducto,
  crearProducto,
  eliminarProducto,
  listarProductos,
  obtenerProducto,
} from '../controllers/productos.controller.js';

const router = Router();

const idValido = param('id').isInt({ min: 1 }).withMessage('El id debe ser un entero positivo');

const filtros = [
  query('ID_categoria').optional().isInt({ min: 1 }).withMessage('ID_categoria debe ser entero'),
  query('categoria').optional().isInt({ min: 1 }).withMessage('categoria debe ser un ID entero'),
  query('destacado').optional().isIn(['0', '1', 'true', 'false']).withMessage('destacado debe ser 0/1/true/false'),
  query('con_descuento').optional().isIn(['0', '1', 'true', 'false']).withMessage('con_descuento debe ser 0/1/true/false'),
  query('q').optional().isString().trim().isLength({ max: 150 }),
  query('nombre').optional().isString().trim().isLength({ max: 150 }),
  query('limit').optional().isInt({ min: 1, max: 200 }).withMessage('limit debe ser un entero entre 1 y 200'),
  query('offset').optional().isInt({ min: 0 }).withMessage('offset debe ser un entero mayor o igual a 0'),
];

/** Reglas de las columnas; en POST son obligatorias y en PUT opcionales. */
function reglas({ obligatorio }) {
  const requerir = (campo) =>
    obligatorio
      ? body(campo).exists({ values: 'null' }).withMessage(`${campo} es obligatorio`).bail()
      : body(campo).optional();

  return [
    requerir('ID_categoria').isInt({ min: 1 }).withMessage('ID_categoria debe ser entero positivo'),
    requerir('ID_unidad').isInt({ min: 1 }).withMessage('ID_unidad debe ser entero positivo'),
    body('ID_Descuento').optional({ nullable: true }).isInt({ min: 1 }).withMessage('ID_Descuento debe ser entero o null'),
    requerir('nombre_producto').isString().bail().trim().notEmpty().withMessage('nombre_producto es obligatorio (maximo 150 caracteres)')
      .isLength({ max: 150 }).withMessage('nombre_producto es obligatorio (maximo 150 caracteres)'),
    requerir('precio_producto').isFloat({ min: 0 }).withMessage('precio_producto debe ser un numero >= 0'),
    body('imagen').optional({ nullable: true }).isString().trim().isLength({ max: 255 }),
    body('descripcion').optional({ nullable: true }).isString(),
    body('destacado').optional().isBoolean().withMessage('destacado debe ser true o false'),
    body('cantidad_producto').optional().isFloat({ min: 0 }).withMessage('cantidad_producto debe ser un numero >= 0'),
    body('factor_pieza').optional().isFloat({ min: 0 }).withMessage('factor_pieza debe ser un numero >= 0'),
  ];
}

router.get('/', filtros, validate, listarProductos);
router.get('/:id', idValido, validate, obtenerProducto);
router.post('/', reglas({ obligatorio: true }), validate, crearProducto);
router.put('/:id', idValido, reglas({ obligatorio: false }), validate, actualizarProducto);
router.patch('/:id', idValido, reglas({ obligatorio: false }), validate, actualizarProducto);
router.delete('/:id', idValido, validate, eliminarProducto);

export default router;

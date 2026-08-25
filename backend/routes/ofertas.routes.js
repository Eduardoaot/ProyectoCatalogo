import { Router } from 'express';
import { body, param } from 'express-validator';
import { validate } from '../middlewares/validate.js';
import {
  actualizarOferta,
  crearOferta,
  eliminarOferta,
  listarOfertas,
  obtenerOferta,
} from '../controllers/ofertas.controller.js';

const router = Router();

const idValido = param('id').isInt({ min: 1 }).withMessage('El id debe ser un entero positivo');

function reglas({ obligatorio }) {
  const requerir = (campo) =>
    obligatorio
      ? body(campo).exists({ values: 'null' }).withMessage(`${campo} es obligatorio`).bail()
      : body(campo).optional();

  return [
    requerir('titulo_oferta').isString().bail().trim().notEmpty().withMessage('titulo_oferta es obligatorio (maximo 150 caracteres)')
      .isLength({ max: 150 }).withMessage('titulo_oferta es obligatorio (maximo 150 caracteres)'),
    body('ID_codigo_descuento').optional({ nullable: true }).isInt({ min: 1 })
      .withMessage('ID_codigo_descuento debe ser entero o null'),
    body('ID_categoria').optional({ nullable: true }).isInt({ min: 1 })
      .withMessage('ID_categoria debe ser entero o null'),
    body('descripcion_oferta').optional({ nullable: true }).isString().trim().isLength({ max: 255 }),
    body('descripcion_beneficio').optional({ nullable: true }).isString().trim().isLength({ max: 255 }),
    body('imagen_oferta').optional({ nullable: true }).isString().trim().isLength({ max: 255 }),
  ];
}

router.get('/', listarOfertas);
router.get('/:id', idValido, validate, obtenerOferta);
router.post('/', reglas({ obligatorio: true }), validate, crearOferta);
router.put('/:id', idValido, reglas({ obligatorio: false }), validate, actualizarOferta);
router.delete('/:id', idValido, validate, eliminarOferta);

export default router;

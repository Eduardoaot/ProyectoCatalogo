import { Router } from 'express';
import { body, param } from 'express-validator';
import { validate } from '../middlewares/validate.js';
import {
  actualizarTipo,
  crearTipo,
  eliminarTipo,
  listarTipos,
  obtenerTipo,
} from '../controllers/descuentosTipos.controller.js';
import {
  actualizarValor,
  crearValor,
  eliminarValor,
  listarValores,
  obtenerValor,
} from '../controllers/descuentosValores.controller.js';
import {
  actualizarCodigo,
  crearCodigo,
  eliminarCodigo,
  listarCodigos,
  obtenerCodigo,
  validarCodigo,
} from '../controllers/descuentosCodigo.controller.js';

const router = Router();

const idValido = param('id').isInt({ min: 1 }).withMessage('El id debe ser un entero positivo');
const FORMATO_FECHA = /^\d{4}-\d{2}-\d{2}$/;

/* ---------------------------------------------------------------
 * /descuentos/tipos  -> Descuentos_tipos
 * ------------------------------------------------------------- */
const tipoValido = body('tipo_descuento')
  .isString()
  .bail()
  .trim()
  .notEmpty()
  .withMessage('tipo_descuento es obligatorio')
  .isLength({ max: 50 });

router.get('/tipos', listarTipos);
router.get('/tipos/:id', idValido, validate, obtenerTipo);
router.post('/tipos', tipoValido, validate, crearTipo);
router.put('/tipos/:id', idValido, tipoValido, validate, actualizarTipo);
router.delete('/tipos/:id', idValido, validate, eliminarTipo);

/* ---------------------------------------------------------------
 * /descuentos/valores  -> Descuentos_valores
 * ------------------------------------------------------------- */
function reglasValor({ obligatorio }) {
  const requerir = (campo) =>
    obligatorio
      ? body(campo).exists({ values: 'null' }).withMessage(`${campo} es obligatorio`).bail()
      : body(campo).optional();

  return [
    requerir('ID_descuento_tipo').isInt({ min: 1 }).withMessage('ID_descuento_tipo debe ser entero positivo'),
    requerir('nombre_descuento').isString().bail().trim().notEmpty().withMessage('nombre_descuento es obligatorio (maximo 100 caracteres)')
      .isLength({ max: 100 }).withMessage('nombre_descuento es obligatorio (maximo 100 caracteres)'),
    body('descuento_valor').optional().isFloat({ min: 0 }).withMessage('descuento_valor debe ser un numero >= 0'),
    body('cantidad_lleva').optional({ nullable: true }).isInt({ min: 1 }).withMessage('cantidad_lleva debe ser entero >= 1'),
    body('cantidad_paga').optional({ nullable: true }).isInt({ min: 0 }).withMessage('cantidad_paga debe ser entero >= 0'),
    body('fecha_inicio').optional({ nullable: true }).matches(FORMATO_FECHA).withMessage('fecha_inicio debe tener formato YYYY-MM-DD'),
    body('fecha_final').optional({ nullable: true }).matches(FORMATO_FECHA).withMessage('fecha_final debe tener formato YYYY-MM-DD'),
    body().custom((valores) => {
      if (valores.fecha_inicio && valores.fecha_final && valores.fecha_final < valores.fecha_inicio) {
        throw new Error('fecha_final no puede ser anterior a fecha_inicio');
      }
      if (valores.cantidad_lleva && valores.cantidad_paga !== undefined && valores.cantidad_paga !== null
          && Number(valores.cantidad_paga) >= Number(valores.cantidad_lleva)) {
        throw new Error('cantidad_paga debe ser menor que cantidad_lleva');
      }
      return true;
    }),
  ];
}

router.get('/valores', listarValores);
router.get('/valores/:id', idValido, validate, obtenerValor);
router.post('/valores', reglasValor({ obligatorio: true }), validate, crearValor);
router.put('/valores/:id', idValido, reglasValor({ obligatorio: false }), validate, actualizarValor);
router.delete('/valores/:id', idValido, validate, eliminarValor);

/* ---------------------------------------------------------------
 * /descuentos/codigos  -> Descuentos_codigo
 * ------------------------------------------------------------- */
function reglasCodigo({ obligatorio }) {
  const requerir = (campo) =>
    obligatorio
      ? body(campo).exists({ values: 'null' }).withMessage(`${campo} es obligatorio`).bail()
      : body(campo).optional();

  return [
    requerir('ID_descuento').isInt({ min: 1 }).withMessage('ID_descuento debe ser entero positivo'),
    requerir('texto_codigo').isString().bail().trim().notEmpty().withMessage('texto_codigo es obligatorio (maximo 50 caracteres)')
      .isLength({ max: 50 }).withMessage('texto_codigo es obligatorio (maximo 50 caracteres)'),
    body('etiqueta_codigo').optional({ nullable: true }).isString().trim().isLength({ max: 100 }),
    body('descripcion_codigo').optional({ nullable: true }).isString().trim().isLength({ max: 255 }),
  ];
}

router.get('/codigos', listarCodigos);
router.get('/codigos/:id', idValido, validate, obtenerCodigo);
router.post('/codigos', reglasCodigo({ obligatorio: true }), validate, crearCodigo);
router.put('/codigos/:id', idValido, reglasCodigo({ obligatorio: false }), validate, actualizarCodigo);
router.delete('/codigos/:id', idValido, validate, eliminarCodigo);

/* ---------------------------------------------------------------
 * Validacion de un codigo tecleado por el cliente
 * ------------------------------------------------------------- */
router.post(
  '/validar-codigo',
  body('texto_codigo')
    .isString()
    .withMessage('texto_codigo es obligatorio')
    .bail()
    .trim()
    .notEmpty()
    .withMessage('texto_codigo es obligatorio')
    .isLength({ max: 50 }),
  validate,
  validarCodigo,
);

export default router;

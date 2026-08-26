import { crearCrudSimple } from '../utils/crudSimple.js';

export const {
  listar: listarTipos,
  obtener: obtenerTipo,
  crear: crearTipo,
  actualizar: actualizarTipo,
  eliminar: eliminarTipo,
} = crearCrudSimple({
  tabla: 'Descuentos_tipos',
  idColumna: 'ID_descuento_tipo',
  campo: 'tipo_descuento',
  etiqueta: 'Tipo de descuento',
});

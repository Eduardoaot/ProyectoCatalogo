import { crearCrudSimple } from '../utils/crudSimple.js';

export const {
  listar: listarUnidades,
  obtener: obtenerUnidad,
  crear: crearUnidad,
  actualizar: actualizarUnidad,
  eliminar: eliminarUnidad,
} = crearCrudSimple({
  tabla: 'Unidades',
  idColumna: 'ID_unidad',
  campo: 'nombre_unidad',
  etiqueta: 'Unidad',
});

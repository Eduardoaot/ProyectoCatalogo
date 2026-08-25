import { crearCrudSimple } from '../utils/crudSimple.js';

export const {
  listar: listarCategorias,
  obtener: obtenerCategoria,
  crear: crearCategoria,
  actualizar: actualizarCategoria,
  eliminar: eliminarCategoria,
} = crearCrudSimple({
  tabla: 'Categorias',
  idColumna: 'ID_categoria',
  campo: 'nombre_categoria',
  etiqueta: 'Categoria',
});

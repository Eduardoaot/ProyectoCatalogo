import { crearCrudTabla } from '../utils/crudTabla.js';

const SELECT_OFERTA = `
  SELECT o.ID_oferta,
         o.titulo_oferta,
         o.descripcion_oferta,
         o.descripcion_beneficio,
         o.imagen_oferta,
         o.ID_categoria,
         c.nombre_categoria,
         o.ID_codigo_descuento,
         dc.texto_codigo,
         dc.etiqueta_codigo,
         dc.ID_descuento
    FROM Ofertas o
    LEFT JOIN Categorias c        ON c.ID_categoria         = o.ID_categoria
    LEFT JOIN Descuentos_codigo dc ON dc.ID_descuento_codigo = o.ID_codigo_descuento
`;

function mapear(fila) {
  if (!fila) return fila;
  return {
    ID_oferta: fila.ID_oferta,
    titulo_oferta: fila.titulo_oferta,
    descripcion_oferta: fila.descripcion_oferta,
    descripcion_beneficio: fila.descripcion_beneficio,
    imagen_oferta: fila.imagen_oferta,
    categoria: fila.ID_categoria
      ? { ID_categoria: fila.ID_categoria, nombre_categoria: fila.nombre_categoria }
      : null,
    codigo: fila.ID_codigo_descuento
      ? {
          ID_descuento_codigo: fila.ID_codigo_descuento,
          texto_codigo: fila.texto_codigo,
          etiqueta_codigo: fila.etiqueta_codigo,
          ID_descuento: fila.ID_descuento,
        }
      : null,
  };
}

export const {
  listar: listarOfertas,
  obtener: obtenerOferta,
  crear: crearOferta,
  actualizar: actualizarOferta,
  eliminar: eliminarOferta,
} = crearCrudTabla({
  tabla: 'Ofertas',
  idColumna: 'ID_oferta',
  etiqueta: 'Oferta',
  columnas: [
    'ID_codigo_descuento',
    'ID_categoria',
    'titulo_oferta',
    'descripcion_oferta',
    'descripcion_beneficio',
    'imagen_oferta',
  ],
  select: SELECT_OFERTA,
  filtroId: 'o.ID_oferta',
  orden: 'ORDER BY o.ID_oferta DESC',
  mapear,
});

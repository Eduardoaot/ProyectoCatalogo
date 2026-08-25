import { crearCrudTabla } from '../utils/crudTabla.js';
import { clasificarTipo, estaVigente } from '../utils/descuentos.js';

const SELECT_VALOR = `
  SELECT dv.ID_descuento,
         dv.ID_descuento_tipo,
         dt.tipo_descuento,
         dv.nombre_descuento,
         dv.descuento_valor,
         dv.cantidad_lleva,
         dv.cantidad_paga,
         dv.fecha_inicio,
         dv.fecha_final
    FROM Descuentos_valores dv
    INNER JOIN Descuentos_tipos dt ON dt.ID_descuento_tipo = dv.ID_descuento_tipo
`;

function mapear(fila) {
  if (!fila) return fila;
  return {
    ...fila,
    tipo_normalizado: clasificarTipo(fila.tipo_descuento),
    vigente: estaVigente(fila),
  };
}

export const {
  listar: listarValores,
  obtener: obtenerValor,
  crear: crearValor,
  actualizar: actualizarValor,
  eliminar: eliminarValor,
} = crearCrudTabla({
  tabla: 'Descuentos_valores',
  idColumna: 'ID_descuento',
  etiqueta: 'Descuento',
  columnas: [
    'ID_descuento_tipo',
    'nombre_descuento',
    'descuento_valor',
    'cantidad_lleva',
    'cantidad_paga',
    'fecha_inicio',
    'fecha_final',
  ],
  select: SELECT_VALOR,
  filtroId: 'dv.ID_descuento',
  orden: 'ORDER BY dv.ID_descuento DESC',
  mapear,
});

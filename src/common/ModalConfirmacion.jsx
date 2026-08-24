import { createPortal } from 'react-dom'
import { IconoAlerta } from './iconos'
import './ModalConfirmacion.css'

// Modal de confirmación genérico para acciones destructivas (vaciar el
// carrito, eliminar un producto, etc.). Se controla desde afuera: si
// `abierto` es false no renderiza nada.
//
// Se monta con un portal directo a document.body: si se renderizara en su
// lugar normal dentro del árbol, quedaría dentro de ".page-transicion"
// (tiene una animación con transform, lo que convierte a ese contenedor en
// el "containing block" del position:fixed) y el fondo oscuro se vería
// recortado al ancho de la página en vez de cubrir toda la pantalla.
function ModalConfirmacion({
  abierto,
  titulo,
  mensaje,
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
  onConfirmar,
  onCancelar,
}) {
  if (!abierto) return null

  return createPortal(
    <div className="modal-confirmacion__fondo" onClick={onCancelar}>
      <div
        className="modal-confirmacion"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="modal-confirmacion-titulo"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-confirmacion__icono">
          <IconoAlerta className="modal-confirmacion__icono-svg" />
        </div>
        <h3 id="modal-confirmacion-titulo">{titulo}</h3>
        <p>{mensaje}</p>
        <div className="modal-confirmacion__acciones">
          <button type="button" className="modal-confirmacion__cancelar" onClick={onCancelar}>
            {textoCancelar}
          </button>
          <button type="button" className="modal-confirmacion__confirmar" onClick={onConfirmar}>
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default ModalConfirmacion

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { usePreferencias } from '../../../context/PreferenciasContext'
import { useTienda } from '../../../context/TiendaContext'
import { useFavoritos } from '../../../context/FavoritosContext'
import ImagenProducto from '../../../common/ImagenProducto'
import { IconoCorazon } from '../../../common/iconos'
import { formatearCantidad, MODO_PIEZA, modoPorDefecto, pasoDeProducto } from '../../../data/unidades'
import './ProductCard.css'

function ProductCard({ producto }) {
  const { id, nombre, categoria, precio, precioOriginal, unidad, emoji, destacado } = producto
  const { agregarAlCarrito, obtenerStockRestante } = useTienda()
  const { esFavorito, alternar } = useFavoritos()
  const { t } = usePreferencias()
  const navigate = useNavigate()
  const stockRestante = obtenerStockRestante(id)
  // Fuera del detalle no hay dónde elegir kilos, así que un clic agrega UNA
  // PIEZA (0.18 kg de manzana, no un kilo entero). En lo que no se vende a
  // granel esto sigue siendo 1 unidad, como siempre.
  const modo = modoPorDefecto(producto)
  const cantidadPorClic = pasoDeProducto(producto, modo)
  // "Sin stock" no es "stock en cero": puede quedar medio kilo y aun así no
  // alcanzar para una pieza más.
  const sinStock = stockRestante < cantidadPorClic
  const tieneDescuentoPropio = precioOriginal > precio
  const favorito = esFavorito(id)
  // 'agregar' | 'quitar' | null. Guarda hacia dónde va el corazón para poder
  // animarlo distinto al ponerlo que al quitarlo. Se marca en el clic (no
  // mirando `favorito`) porque el estado real cambia un instante después,
  // cuando responde el contexto de favoritos.
  const [animacionFavorito, setAnimacionFavorito] = useState(null)

  // El botón vive dentro del <Link> de la tarjeta: hay que frenar la
  // navegación y la propagación para que "Agregar" no abra el detalle.
  const handleAgregar = (e) => {
    e.preventDefault()
    e.stopPropagation()
    agregarAlCarrito(producto, cantidadPorClic, modo)
  }

  // Sin sesión, `alternar` no hace nada y avisa con `necesitaSesion`: se
  // manda a iniciar sesión en vez de dejar el corazón sin respuesta visible.
  const handleFavorito = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setAnimacionFavorito(favorito ? 'quitar' : 'agregar')
    const resultado = await alternar(producto)
    if (resultado.necesitaSesion) {
      navigate('/login', { state: { from: `/producto/${id}` } })
    }
  }

  const clasesFavorito = [
    'product-card__favorito',
    favorito ? 'is-active' : '',
    animacionFavorito ? `is-animando-${animacionFavorito}` : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Link to={`/producto/${id}`} className="product-card">
      {/* Etiqueta colgante de "Destacado": la forma (punta, ojal y cordón)
          está hecha con CSS y un SVG inline, no con una imagen. */}
      {destacado && (
        <span className="product-card__etiqueta">
          <svg
            className="product-card__etiqueta-cordon"
            viewBox="0 0 40 32"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M16 27C5 24 6 7 20 5c11-1.5 15 3.5 13.5 7.5" />
          </svg>
          <span className="product-card__etiqueta-cuerpo">
            <span className="product-card__etiqueta-ojal" aria-hidden="true" />
            {t('producto.destacado')}
          </span>
        </span>
      )}

      <button
        type="button"
        className={clasesFavorito}
        onClick={handleFavorito}
        onAnimationEnd={() => setAnimacionFavorito(null)}
        aria-label={favorito ? t('fav.quitar') : t('fav.agregar')}
      >
        <IconoCorazon className="product-card__favorito-icono" relleno={favorito} />
      </button>

      <div className="product-card__image">
        <ImagenProducto valor={emoji} alt={nombre} />
        {/* Flota sobre la esquina inferior izquierda de la foto: así la imagen
            se puede llevar todo el alto que antes ocupaba este botón. */}
        <button
          type="button"
          className="product-card__agregar"
          onClick={handleAgregar}
          disabled={sinStock}
          title={
            modo === MODO_PIEZA
              ? t('producto.agregaUnaPieza', {
                  cantidad: formatearCantidad(cantidadPorClic),
                  unidad: unidad,
                })
              : undefined
          }
        >
          {!sinStock && (
            <span className="product-card__agregar-mas" aria-hidden="true">
              +
            </span>
          )}
          {sinStock ? t('producto.sinStock') : t('producto.agregarCorto')}
        </button>
      </div>

      <span className="product-card__categoria">{t(`cat.${categoria}`)}</span>
      <h3 className="product-card__nombre">{nombre}</h3>
      <p className="product-card__precio">
        ${precio.toFixed(2)} <span>/ {unidad}</span>
        {tieneDescuentoPropio && (
          <span className="product-card__precio-original">${precioOriginal.toFixed(2)}</span>
        )}
      </p>
    </Link>
  )
}

export default ProductCard

import { Link, useNavigate } from 'react-router-dom'
import { usePreferencias } from '../../../context/PreferenciasContext'
import { useTienda } from '../../../context/TiendaContext'
import { useFavoritos } from '../../../context/FavoritosContext'
import ImagenProducto from '../../../common/ImagenProducto'
import { IconoCorazon } from '../../../common/iconos'
import './ProductCard.css'

function ProductCard({ producto }) {
  const { id, nombre, categoria, precio, precioOriginal, unidad, emoji, destacado } = producto
  const { agregarAlCarrito, obtenerStockRestante } = useTienda()
  const { esFavorito, alternar } = useFavoritos()
  const { t } = usePreferencias()
  const navigate = useNavigate()
  const stockRestante = obtenerStockRestante(id)
  const tieneDescuentoPropio = precioOriginal > precio
  const favorito = esFavorito(id)

  // El botón vive dentro del <Link> de la tarjeta: hay que frenar la
  // navegación y la propagación para que "Agregar" no abra el detalle.
  const handleAgregar = (e) => {
    e.preventDefault()
    e.stopPropagation()
    agregarAlCarrito(producto, 1)
  }

  // Sin sesión, `alternar` no hace nada y avisa con `necesitaSesion`: se
  // manda a iniciar sesión en vez de dejar el corazón sin respuesta visible.
  const handleFavorito = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    const resultado = await alternar(producto)
    if (resultado.necesitaSesion) {
      navigate('/login', { state: { from: `/producto/${id}` } })
    }
  }

  return (
    <Link to={`/producto/${id}`} className="product-card">
      {destacado && <span className="product-card__badge">{t('producto.destacado')}</span>}
      <button
        type="button"
        className={favorito ? 'product-card__favorito is-active' : 'product-card__favorito'}
        onClick={handleFavorito}
        aria-label={favorito ? t('fav.quitar') : t('fav.agregar')}
      >
        <IconoCorazon className="product-card__favorito-icono" relleno={favorito} />
      </button>
      <div className="product-card__image">
        <ImagenProducto valor={emoji} alt={nombre} />
      </div>
      <span className="product-card__categoria">{t(`cat.${categoria}`)}</span>
      <h3 className="product-card__nombre">{nombre}</h3>
      <p className="product-card__precio">
        ${precio.toFixed(2)} <span>/ {unidad}</span>
        {tieneDescuentoPropio && (
          <span className="product-card__precio-original">${precioOriginal.toFixed(2)}</span>
        )}
      </p>
      <button
        type="button"
        className="product-card__agregar"
        onClick={handleAgregar}
        disabled={stockRestante <= 0}
      >
        {stockRestante <= 0 ? t('producto.sinStock') : t('producto.agregar')}
      </button>
    </Link>
  )
}

export default ProductCard

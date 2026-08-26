import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ImagenProducto from '../../common/ImagenProducto'
import { IconoCorazon } from '../../common/iconos'
import { useCatalogo } from '../../context/CatalogoContext'
import { useFavoritos } from '../../context/FavoritosContext'
import { usePreferencias } from '../../context/PreferenciasContext'
import { useTienda } from '../../context/TiendaContext'
import './ProductoDetalle.css'

function ProductoDetalle() {
  const { id } = useParams()
  const { buscarProducto, cargando } = useCatalogo()
  const producto = buscarProducto(id)
  const { agregarAlCarrito, obtenerStockRestante } = useTienda()
  const { esFavorito, alternar } = useFavoritos()
  const { t } = usePreferencias()
  const navigate = useNavigate()
  const [cantidad, setCantidad] = useState(1)
  const [errorCantidad, setErrorCantidad] = useState('')

  // Sin esto, al entrar directo a /producto/3 se vería "Producto no
  // encontrado" durante el instante en que el catálogo todavía viene en camino.
  if (cargando) {
    return (
      <section className="producto-detalle">
        <p>{t('producto.cargando')}</p>
      </section>
    )
  }

  if (!producto) {
    return (
      <section className="producto-detalle">
        <p>{t('producto.noEncontrado')}</p>
        <Link to="/">{t('producto.volver')}</Link>
      </section>
    )
  }

  const stockRestante = obtenerStockRestante(producto.id)
  const tieneDescuentoPropio = producto.precioOriginal > producto.precio
  const favorito = esFavorito(producto.id)

  // Permite escribir la cantidad a mano (no solo +/-), validando que nunca
  // supere el stock disponible ni baje de 1.
  const handleCantidadInput = (e) => {
    const valor = e.target.value
    if (valor === '') {
      setCantidad('')
      setErrorCantidad('')
      return
    }
    const numero = Math.floor(Number(valor))
    if (Number.isNaN(numero)) return
    if (numero > stockRestante) {
      setCantidad(stockRestante)
      setErrorCantidad(t('producto.soloHay', { n: stockRestante }))
      return
    }
    setErrorCantidad('')
    setCantidad(Math.max(1, numero))
  }

  const handleCantidadBlur = () => {
    if (cantidad === '' || cantidad < 1) {
      setCantidad(1)
      setErrorCantidad('')
    }
  }

  const handleAgregar = () => {
    agregarAlCarrito(producto, cantidad === '' ? 1 : cantidad)
    setCantidad(1)
    setErrorCantidad('')
  }

  const handleFavorito = async () => {
    const resultado = await alternar(producto)
    if (resultado.necesitaSesion) {
      navigate('/login', { state: { from: `/producto/${producto.id}` } })
    }
  }

  return (
    <section className="producto-detalle">
      <Link to="/" className="producto-detalle__volver">
        &larr; {t('producto.volver')}
      </Link>

      <div className="details">
        <div className="detail-img">
          <ImagenProducto valor={producto.emoji} alt={producto.nombre} />
        </div>
        <div className="detail-info">
          <div className="detail-cabecera">
            <p className="detail-category">{t(`cat.${producto.categoria}`)}</p>
            <button
              type="button"
              className={favorito ? 'detail-favorito is-active' : 'detail-favorito'}
              onClick={handleFavorito}
            >
              <IconoCorazon className="detail-favorito-icono" relleno={favorito} />
              {favorito ? t('fav.quitar') : t('fav.agregar')}
            </button>
          </div>
          <h1 className="detail-name font-outfit">{producto.nombre}</h1>
          <div className="detail-precio-fila">
            <h2 className="detail-price font-outfit">${producto.precio.toFixed(2)}</h2>
            {tieneDescuentoPropio && (
              <span className="detail-price-original">${producto.precioOriginal.toFixed(2)}</span>
            )}
            <h4 className="detail-unit font-dmsans">{t('producto.por', { unidad: producto.unidad })}</h4>
          </div>
          <h4 className="detail-description-title font-dmsans">{t('producto.descripcion')}</h4>
          <p className="detail-description">{producto.descripcion}</p>

          <p className="detail-stock">
            {stockRestante > 0
              ? t('producto.disponibles', { n: stockRestante })
              : t('producto.sinStockDisponible')}
          </p>

          <div className="detail-agregar">
            <div className="detail-cantidad">
              <button
                type="button"
                onClick={() => setCantidad((c) => Math.max(1, (c === '' ? 1 : c) - 1))}
                disabled={cantidad <= 1}
                aria-label={t('producto.disminuir')}
              >
                −
              </button>
              <input
                type="number"
                className="detail-cantidad-input"
                min={1}
                max={stockRestante || 1}
                value={cantidad}
                onChange={handleCantidadInput}
                onBlur={handleCantidadBlur}
                aria-label={t('producto.cantidad')}
              />
              <button
                type="button"
                onClick={() => setCantidad((c) => Math.min(stockRestante, (c === '' ? 0 : c) + 1))}
                disabled={cantidad !== '' && cantidad >= stockRestante}
                aria-label={t('producto.aumentar')}
              >
                +
              </button>
            </div>
            <button
              type="button"
              className="detail-agregar-boton"
              onClick={handleAgregar}
              disabled={stockRestante <= 0 || cantidad === '' || cantidad < 1}
            >
              {stockRestante <= 0 ? t('producto.sinStock') : t('producto.agregar')}
            </button>
          </div>
          {errorCantidad && <p className="detail-cantidad-error">{errorCantidad}</p>}
        </div>
      </div>
    </section>
  )
}

export default ProductoDetalle

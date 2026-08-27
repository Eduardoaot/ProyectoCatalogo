import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ImagenProducto from '../../common/ImagenProducto'
import { IconoCorazon } from '../../common/iconos'
import { useCatalogo } from '../../context/CatalogoContext'
import { useFavoritos } from '../../context/FavoritosContext'
import { usePreferencias } from '../../context/PreferenciasContext'
import { useTienda } from '../../context/TiendaContext'
import {
  esKilogramo,
  factorPiezaDe,
  formatearCantidad,
  MODO_PIEZA,
  MODO_UNIDAD,
  PASO_KILOGRAMO,
  permiteDecimales,
  permitePorPieza,
  redondearCantidad,
  tieneFactorReal,
} from '../../data/unidades'
import './ProductoDetalle.css'

function ProductoDetalle() {
  const { id } = useParams()
  const { buscarProducto, cargando } = useCatalogo()
  const producto = buscarProducto(id)
  const { agregarAlCarrito, obtenerStockRestante } = useTienda()
  const { esFavorito, alternar } = useFavoritos()
  const { t } = usePreferencias()
  const navigate = useNavigate()
  // 'unidad' = a granel (kg, litros...); 'pieza' = de a piezas sueltas.
  const [modo, setModo] = useState('unidad')
  // La cantidad se guarda como texto: con decimales hace falta poder escribir
  // estados intermedios ("0.", "1,5") sin que el campo los descarte a medias.
  const [textoCantidad, setTextoCantidad] = useState('1')
  const [errorCantidad, setErrorCantidad] = useState('')
  // 'agregar' | 'quitar' | null. Igual que en la tarjeta del catálogo: la
  // dirección se marca en el clic y no leyendo `favorito`, porque el estado
  // real cambia un instante después, cuando responde el contexto.
  const [animacionFavorito, setAnimacionFavorito] = useState(null)

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

  // ---- Unidad de compra -------------------------------------------------
  // Lo que se vende por kilogramo admite decimales y, si la base trae un
  // factor_pieza distinto de 1, también se puede comprar de a piezas: el
  // factor convierte piezas -> unidad de venta (3 manzanas x 0.18 = 0.54 kg).
  // Todo lo demás (litros, piezas, paquetes...) se compra siempre en enteros.
  const esKilo = esKilogramo(producto)
  const factorPieza = factorPiezaDe(producto)
  const puedeElegirModo = permitePorPieza(producto)
  const porPieza = puedeElegirModo && modo === 'pieza'
  const decimalesOk = permiteDecimales(producto, porPieza ? MODO_PIEZA : MODO_UNIDAD)

  const paso = porPieza || !esKilo ? 1 : PASO_KILOGRAMO
  // Tope expresado en la unidad del modo activo (piezas o kg). Fuera del
  // kilogramo el stock también se redondea hacia abajo al entero: no tendría
  // sentido dejar comprar hasta "4.7 piezas".
  const maximo = porPieza
    ? Math.floor(stockRestante / factorPieza)
    : decimalesOk
      ? redondearCantidad(stockRestante)
      : Math.floor(stockRestante)

  const cantidad = Number(String(textoCantidad).replace(',', '.'))
  const cantidadValida = Number.isFinite(cantidad) && cantidad > 0
  // Lo que de verdad va al carrito y a la orden: siempre en la unidad de venta.
  const cantidadEnUnidad = cantidadValida
    ? redondearCantidad(porPieza ? cantidad * factorPieza : cantidad)
    : 0

  const mensajeTope = () => {
    if (porPieza) return t('producto.soloHayPiezas', { n: maximo })
    if (esKilo) {
      return t('producto.soloHayUnidad', {
        n: formatearCantidad(maximo),
        unidad: producto.unidad,
      })
    }
    return t('producto.soloHay', { n: maximo })
  }

  const fijarCantidad = (valor) => {
    const tope = Math.max(maximo, 0)
    // Fuera del kilogramo suelto, redondear (no truncar) al entero más
    // cercano: los botones +/- ya avanzan de a `paso` = 1, así que esto solo
    // protege contra un valor de arranque que llegara con decimales.
    const base = decimalesOk ? redondearCantidad(valor) : Math.round(valor)
    const limitada = Math.min(Math.max(base, paso), tope)
    setTextoCantidad(formatearCantidad(limitada))
    setErrorCantidad('')
  }

  // Deja escribir libremente y solo interviene cuando el número se pasa del
  // stock; el redondeo final se hace al salir del campo (onBlur). El propio
  // tecleo ya filtra caracteres que no sean números — y, si la unidad/modo no
  // admite decimales, tampoco deja escribir el separador decimal.
  const handleCantidadInput = (e) => {
    const crudo = e.target.value
    const bruto = decimalesOk ? crudo.replace(/[^0-9.,]/g, '') : crudo.replace(/[^0-9]/g, '')
    setTextoCantidad(bruto)
    const numero = Number(bruto.replace(',', '.'))
    if (bruto === '' || !Number.isFinite(numero)) {
      setErrorCantidad('')
      return
    }
    if (numero > maximo) {
      setTextoCantidad(formatearCantidad(Math.max(maximo, 0)))
      setErrorCantidad(mensajeTope())
      return
    }
    setErrorCantidad('')
  }

  const handleCantidadBlur = () => {
    fijarCantidad(cantidadValida ? cantidad : paso)
  }

  // Al cambiar de kilo a pieza (o al revés) se conserva más o menos lo mismo
  // que había pedido el usuario, en vez de reiniciar el campo a 1.
  const cambiarModo = (nuevo) => {
    if (nuevo === modo) return
    let enUnidad = factorPieza
    if (cantidadValida) {
      enUnidad = porPieza ? cantidad * factorPieza : cantidad
    }
    if (nuevo === 'pieza') {
      const piezas = Math.max(1, Math.round(enUnidad / factorPieza))
      setTextoCantidad(formatearCantidad(Math.min(piezas, Math.floor(stockRestante / factorPieza))))
    } else {
      const kilos = Math.max(PASO_KILOGRAMO, redondearCantidad(enUnidad))
      setTextoCantidad(formatearCantidad(Math.min(kilos, redondearCantidad(stockRestante))))
    }
    setModo(nuevo)
    setErrorCantidad('')
  }

  const handleAgregar = () => {
    if (cantidadEnUnidad <= 0) return
    // La cantidad viaja en unidad de venta (para precio y stock) junto con el
    // modo, para que el carrito y la orden puedan mostrarla como se eligió.
    agregarAlCarrito(
      producto,
      Math.min(cantidadEnUnidad, stockRestante),
      porPieza ? MODO_PIEZA : MODO_UNIDAD,
    )
    fijarCantidad(paso)
  }

  const handleFavorito = async () => {
    setAnimacionFavorito(favorito ? 'quitar' : 'agregar')
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
              className={[
                'detail-favorito',
                favorito ? 'is-active' : '',
                animacionFavorito ? `is-animando-${animacionFavorito}` : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={handleFavorito}
              onAnimationEnd={() => setAnimacionFavorito(null)}
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
            <h4 className="detail-unit font-dmsans">
              {t('producto.por', { unidad: producto.unidad })}
            </h4>
          </div>
          <h4 className="detail-description-title font-dmsans">{t('producto.descripcion')}</h4>
          <p className="detail-description">{producto.descripcion}</p>

          <p className="detail-stock">
            {stockRestante <= 0 && t('producto.sinStockDisponible')}
            {stockRestante > 0 &&
              (esKilo
                ? t('producto.disponiblesUnidad', {
                    n: formatearCantidad(stockRestante),
                    unidad: producto.unidad,
                  })
                : t('producto.disponibles', { n: stockRestante }))}
          </p>

          {puedeElegirModo && (
            <div className="detail-modo">
              <span className="detail-modo-titulo">{t('producto.comoComprar')}</span>
              <div
                className="detail-modo-opciones"
                role="group"
                aria-label={t('producto.comoComprar')}
              >
                <button
                  type="button"
                  className={porPieza ? 'detail-modo-boton' : 'detail-modo-boton is-active'}
                  aria-pressed={!porPieza}
                  onClick={() => cambiarModo('unidad')}
                >
                  {t('producto.modoUnidad', { unidad: producto.unidad })}
                </button>
                <button
                  type="button"
                  className={porPieza ? 'detail-modo-boton is-active' : 'detail-modo-boton'}
                  aria-pressed={porPieza}
                  onClick={() => cambiarModo('pieza')}
                >
                  {t('producto.modoPieza')}
                </button>
              </div>
              {tieneFactorReal(producto) && (
                <p className="detail-modo-equivalencia">
                  {t('producto.pesoPorPieza', {
                    cantidad: formatearCantidad(factorPieza),
                    unidad: producto.unidad,
                  })}
                </p>
              )}
            </div>
          )}

          <div className="detail-agregar">
            <div className="detail-cantidad">
              <button
                type="button"
                onClick={() => fijarCantidad((cantidadValida ? cantidad : paso) - paso)}
                disabled={!cantidadValida || cantidad <= paso}
                aria-label={t('producto.disminuir')}
              >
                &minus;
              </button>
              <input
                type="text"
                inputMode={decimalesOk ? 'decimal' : 'numeric'}
                className="detail-cantidad-input"
                value={textoCantidad}
                onChange={handleCantidadInput}
                onBlur={handleCantidadBlur}
                aria-label={porPieza ? t('producto.piezas') : t('producto.cantidad')}
              />
              <span className="detail-cantidad-unidad">
                {porPieza ? t('producto.piezasCorto') : producto.unidad}
              </span>
              <button
                type="button"
                onClick={() => fijarCantidad((cantidadValida ? cantidad : 0) + paso)}
                disabled={cantidadValida && cantidad >= maximo}
                aria-label={t('producto.aumentar')}
              >
                +
              </button>
            </div>
            <button
              type="button"
              className="detail-agregar-boton"
              onClick={handleAgregar}
              disabled={
                stockRestante <= 0 || cantidadEnUnidad <= 0 || cantidadEnUnidad > stockRestante
              }
            >
              {stockRestante <= 0 ? t('producto.sinStock') : t('producto.agregar')}
            </button>
          </div>

          {/* Comprando por pieza hay que poder ver en qué se traduce lo elegido
              antes de agregarlo: cuántos kilos son y cuánto va a costar. */}
          {cantidadEnUnidad > 0 && (
            <p className="detail-resumen">
              {porPieza && tieneFactorReal(producto) && (
                <span className="detail-resumen-equivale">
                  {t('producto.equivale', {
                    cantidad: formatearCantidad(cantidadEnUnidad),
                    unidad: producto.unidad,
                  })}
                </span>
              )}
              <span className="detail-resumen-subtotal">
                {t('producto.subtotalEstimado', {
                  monto: (producto.precio * cantidadEnUnidad).toFixed(2),
                })}
              </span>
            </p>
          )}

          {errorCantidad && <p className="detail-cantidad-error">{errorCantidad}</p>}
        </div>
      </div>
    </section>
  )
}

export default ProductoDetalle

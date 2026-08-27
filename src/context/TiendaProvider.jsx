import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { validarCodigo } from '../api/catalogo'
import { crearOrden, obtenerOrdenesDeCliente } from '../api/ordenes'
import {
  ajustarAlModo,
  cantidadEnModo,
  MODO_PIEZA,
  MODO_UNIDAD,
  modoPorDefecto,
  pasoDeProducto,
  redondearCantidad,
} from '../data/unidades'
import { useAuth } from './AuthContext'
import { useCatalogo } from './CatalogoContext'
import { TiendaContext } from './TiendaContext'

// El carrito sigue viviendo en el navegador: el esquema de la base no tiene
// tabla de carritos, solo de órdenes. Se guarda por usuario (o "invitado")
// para que cada quien vea el suyo.
//
// El stock, los precios, los descuentos y las órdenes YA NO están aquí:
// vienen de la API. El total de la orden lo calcula siempre el servidor.
const INVITADO = 'invitado'
const claveCarrito = (id) => `rosamark:carrito:${id}`
const claveCodigo = (id) => `rosamark:codigo:${id}`

function leerLocalStorage(clave, valorPorDefecto) {
  try {
    const guardado = localStorage.getItem(clave)
    return guardado ? JSON.parse(guardado) : valorPorDefecto
  } catch {
    return valorPorDefecto
  }
}

/**
 * Vista previa del descuento por código, para pintar el resumen del carrito.
 *
 * Reproduce las mismas reglas que aplica el backend en POST /ordenes. El
 * importe que de verdad se cobra es el que calcula el servidor: esto es solo
 * para que el usuario vea el desglose antes de confirmar.
 */
function calcularDescuentoCodigo(carrito, codigo) {
  if (!codigo?.descuento) return 0

  const idCategoria = codigo.categoria?.ID_categoria ?? null
  const elegibles = idCategoria
    ? carrito.filter((item) => item.producto.categoriaId === idCategoria)
    : carrito

  const base = elegibles.reduce((acc, item) => acc + item.producto.precio * item.cantidad, 0)
  if (base <= 0) return 0

  const { tipo_normalizado: tipo, descuento_valor: valor } = codigo.descuento

  if (tipo === 'porcentaje') {
    return base * (Math.min(Math.max(Number(valor), 0), 100) / 100)
  }

  if (tipo === 'monto_fijo') {
    return Math.min(Math.max(Number(valor), 0), base)
  }

  if (tipo === 'NxM') {
    const lleva = Number(codigo.descuento.cantidad_lleva)
    const paga = Number(codigo.descuento.cantidad_paga)
    if (!lleva || paga >= lleva) return 0
    const monto = elegibles.reduce((acc, item) => {
      const grupos = Math.floor(item.cantidad / lleva)
      return acc + grupos * (lleva - paga) * item.producto.precio
    }, 0)
    return Math.min(monto, base)
  }

  return 0
}

export function TiendaProvider({ children }) {
  const { usuario } = useAuth()
  const { productos, buscarProducto, recargar } = useCatalogo()
  const idActual = usuario?.id ?? INVITADO

  const [carrito, setCarrito] = useState(() => leerLocalStorage(claveCarrito(idActual), []))
  const [codigoAplicado, setCodigoAplicado] = useState(() =>
    leerLocalStorage(claveCodigo(idActual), null),
  )
  const [ordenes, setOrdenes] = useState([])
  // Id del cliente al que pertenecen las órdenes que hay en memoria. Sirve
  // para saber si lo que se está mostrando ya es del usuario actual o si
  // todavía se están pidiendo a la API.
  const [ordenesDe, setOrdenesDe] = useState(null)
  const [panelAbierto, setPanelAbierto] = useState(false)

  const idAnteriorRef = useRef(idActual)

  // Stock disponible según la última lectura del catálogo. Después de generar
  // una orden el catálogo se recarga, así que refleja lo que ya descontó el
  // backend en Productos.cantidad_producto.
  const obtenerStockRestante = useCallback(
    (productoId) => buscarProducto(productoId)?.stock ?? 0,
    [buscarProducto],
  )

  // Al cambiar de usuario, el carrito del invitado se fusiona con el suyo
  // (no se pierde nada al iniciar sesión), igual que antes.
  useEffect(() => {
    if (idAnteriorRef.current === idActual) return
    const idAnterior = idAnteriorRef.current
    idAnteriorRef.current = idActual

    const carritoDestino = leerLocalStorage(claveCarrito(idActual), [])

    if (idAnterior === INVITADO && idActual !== INVITADO) {
      const carritoInvitado = leerLocalStorage(claveCarrito(INVITADO), [])
      const fusionado = carritoDestino.map((item) => ({ ...item }))

      carritoInvitado.forEach((itemInvitado) => {
        const stock = obtenerStockRestante(itemInvitado.productoId)
        const indice = fusionado.findIndex((item) => item.productoId === itemInvitado.productoId)
        if (indice >= 0) {
          fusionado[indice].cantidad = Math.min(
            fusionado[indice].cantidad + itemInvitado.cantidad,
            stock,
          )
          // Si los dos carritos traían el mismo producto pero elegido de
          // formas distintas, la suma ya no es un número exacto de piezas:
          // el renglón pasa a leerse en la unidad de venta.
          if (fusionado[indice].modo !== itemInvitado.modo) {
            fusionado[indice].modo = MODO_UNIDAD
          }
        } else {
          fusionado.push({
            productoId: itemInvitado.productoId,
            cantidad: Math.min(itemInvitado.cantidad, stock),
            modo: itemInvitado.modo ?? MODO_UNIDAD,
          })
        }
      })

      localStorage.setItem(claveCarrito(idActual), JSON.stringify(fusionado))
      localStorage.removeItem(claveCarrito(INVITADO))
      setCarrito(fusionado)

      const codigoInvitado = leerLocalStorage(claveCodigo(INVITADO), null)
      const codigoUsuario = leerLocalStorage(claveCodigo(idActual), null)
      const codigoFinal = codigoUsuario ?? codigoInvitado
      if (codigoFinal) {
        localStorage.setItem(claveCodigo(idActual), JSON.stringify(codigoFinal))
      }
      localStorage.removeItem(claveCodigo(INVITADO))
      setCodigoAplicado(codigoFinal)
    } else {
      setCarrito(carritoDestino)
      setCodigoAplicado(leerLocalStorage(claveCodigo(idActual), null))
    }
  }, [idActual, obtenerStockRestante])

  useEffect(() => {
    localStorage.setItem(claveCarrito(idActual), JSON.stringify(carrito))
  }, [carrito, idActual])

  useEffect(() => {
    if (codigoAplicado) {
      localStorage.setItem(claveCodigo(idActual), JSON.stringify(codigoAplicado))
    } else {
      localStorage.removeItem(claveCodigo(idActual))
    }
  }, [codigoAplicado, idActual])

  // Las órdenes ya no se guardan en el navegador: se piden a la API cada vez
  // que hay (o cambia) la sesión.
  // El estado se actualiza dentro del callback de la promesa, nunca de forma
  // síncrona en el cuerpo del efecto (react-hooks/set-state-in-effect).
  const cargarOrdenes = useCallback(() => {
    const idCliente = usuario?.id ?? null
    const peticion = idCliente ? obtenerOrdenesDeCliente(idCliente) : Promise.resolve([])
    return peticion
      .catch(() => [])
      .then((lista) => {
        setOrdenes(lista)
        setOrdenesDe(idCliente)
      })
  }, [usuario])

  useEffect(() => {
    cargarOrdenes()
  }, [cargarOrdenes])

  const cargandoOrdenes = Boolean(usuario) && ordenesDe !== usuario.id

  /**
   * `cantidad` viene SIEMPRE en la unidad de venta del producto (kg, litros,
   * piezas...): es la cifra que manda para el precio, para la orden y para el
   * stock. `modo` solo recuerda cómo la eligió la persona ('pieza' o 'unidad')
   * para poder mostrársela igual que la pidió; sin esto, "3" en el carrito no
   * decía si eran 3 kilos o 3 piezas.
   *
   * Si no se pasa modo, se usa el del producto: desde la tarjeta del catálogo
   * un clic agrega UNA PIEZA, no un kilo.
   */
  const agregarAlCarrito = (producto, cantidad = 1, modo) => {
    const stock = obtenerStockRestante(producto.id)
    const modoFinal = modo ?? modoPorDefecto(producto)
    setCarrito((actual) => {
      const existente = actual.find((item) => item.productoId === producto.id)
      const cantidadPrevia = existente?.cantidad ?? 0
      // Gana el kilo: si el renglón ya se agregó alguna vez por peso, se queda
      // en kilos aunque ahora se sume por pieza (mezclar peso exacto con
      // piezas ya no es "un número entero de piezas"). Solo se queda en
      // piezas cuando SIEMPRE se agregó por pieza.
      const modoExistente = existente ? (existente.modo ?? MODO_UNIDAD) : null
      const modoResultante =
        existente && (modoExistente === MODO_UNIDAD || modoFinal === MODO_UNIDAD)
          ? MODO_UNIDAD
          : modoFinal
      const nuevaCantidad = ajustarAlModo(
        Math.min(cantidadPrevia + cantidad, stock),
        producto,
        modoResultante,
      )
      if (nuevaCantidad <= 0) return actual
      if (existente) {
        return actual.map((item) =>
          item.productoId === producto.id
            ? { ...item, cantidad: nuevaCantidad, modo: modoResultante }
            : item,
        )
      }
      return [...actual, { productoId: producto.id, cantidad: nuevaCantidad, modo: modoResultante }]
    })
    setPanelAbierto(true)
  }

  // `delta` se cuenta en "toques" de +/-, no en unidades de venta: cuánto vale
  // un toque lo decide el modo del renglón (una pieza, un cuarto de kilo o una
  // unidad), así el botón se mueve en la misma escala que se ve en pantalla.
  const cambiarCantidad = (productoId, delta) => {
    const producto = buscarProducto(productoId)
    const stock = obtenerStockRestante(productoId)
    setCarrito((actual) =>
      actual
        .map((item) => {
          if (item.productoId !== productoId) return item
          const modo = item.modo ?? MODO_UNIDAD
          const paso = pasoDeProducto(producto, modo)
          const nueva = ajustarAlModo(
            Math.min(Math.max(item.cantidad + delta * paso, 0), stock),
            producto,
            modo,
          )
          return { ...item, cantidad: nueva }
        })
        .filter((item) => item.cantidad > 0),
    )
  }

  const eliminarDelCarrito = (productoId) => {
    setCarrito((actual) => actual.filter((item) => item.productoId !== productoId))
  }

  const vaciarCarrito = () => {
    setCarrito([])
    setCodigoAplicado(null)
  }

  // El código se valida contra la base (existe + está vigente); el descuento
  // real se vuelve a calcular en el servidor al generar la orden.
  const aplicarCodigo = async (texto) => {
    try {
      const codigo = await validarCodigo(texto)
      setCodigoAplicado(codigo)
      return { ok: true }
    } catch (error) {
      return { ok: false, error: error.message }
    }
  }

  const quitarCodigo = () => setCodigoAplicado(null)

  const carritoConDetalle = useMemo(
    () =>
      carrito
        .map((item) => {
          const producto = buscarProducto(item.productoId)
          if (!producto) return null
          // Un carrito guardado antes de que existieran los modos no tiene
          // `modo`: ahí un "1" significaba una unidad de venta, no una pieza.
          const modo = item.modo ?? MODO_UNIDAD
          const paso = pasoDeProducto(producto, modo)
          return {
            ...item,
            modo,
            producto,
            stockRestante: producto.stock,
            // Cantidad tal como se muestra (piezas o unidad de venta).
            cantidadMostrada: cantidadEnModo(item.cantidad, producto, modo),
            // "¿Cabe otro toque?" no es "¿queda stock?": en modo pieza puede
            // quedar medio kilo y aun así no alcanzar para una pieza más.
            puedeAumentar: redondearCantidad(item.cantidad + paso) <= producto.stock,
          }
        })
        .filter(Boolean),
    // `productos` entra como dependencia para que el carrito se repinte con
    // los precios y el stock frescos cada vez que se recarga el catálogo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [carrito, productos],
  )

  const subtotalLista = useMemo(
    () =>
      carritoConDetalle.reduce(
        (acc, item) => acc + (item.producto.precioOriginal ?? item.producto.precio) * item.cantidad,
        0,
      ),
    [carritoConDetalle],
  )
  const subtotal = useMemo(
    () => carritoConDetalle.reduce((acc, item) => acc + item.producto.precio * item.cantidad, 0),
    [carritoConDetalle],
  )
  const descuentoProductos = Math.max(0, subtotalLista - subtotal)

  const descuentoCodigo = useMemo(
    () => calcularDescuentoCodigo(carritoConDetalle, codigoAplicado),
    [carritoConDetalle, codigoAplicado],
  )

  const total = Math.max(0, subtotal - descuentoCodigo)
  // Suma de lo que se ve en pantalla, no de kilos: 3 piezas de manzana suman
  // 3, no 0.54. Es lo que espera quien mira el badge del carrito.
  const totalUnidades = useMemo(
    () => redondearCantidad(carritoConDetalle.reduce((acc, item) => acc + item.cantidadMostrada, 0)),
    [carritoConDetalle],
  )

  /**
   * Manda el carrito a POST /ordenes. El backend valida stock, congela
   * precios, aplica descuentos y descuenta existencias en una transacción.
   * Si algo falla no se toca nada y se devuelve el mensaje del servidor.
   */
  const generarOrden = async () => {
    if (carritoConDetalle.length === 0) {
      return { ok: false, error: 'Tu carrito está vacío.' }
    }

    try {
      const orden = await crearOrden(
        carritoConDetalle.map((item) => ({
          productoId: item.productoId,
          // Siempre en unidad de venta: es lo que descuenta stock y lo que
          // cobra el servidor.
          cantidad: item.cantidad,
          // Y aparte, cuántas piezas eran (null si se compró por peso), para
          // que "Mis órdenes" pueda repetir lo que la persona eligió.
          piezas: item.modo === MODO_PIEZA ? item.cantidadMostrada : null,
        })),
        codigoAplicado?.texto ?? null,
      )

      setCarrito([])
      setCodigoAplicado(null)
      // El stock cambió en la base: volver a leer el catálogo y las órdenes.
      await Promise.all([recargar(), cargarOrdenes()])

      return { ok: true, orden }
    } catch (error) {
      return { ok: false, error: error.message }
    }
  }

  const value = {
    carrito: carritoConDetalle,
    totalUnidades,
    subtotalLista,
    subtotal,
    descuentoProductos,
    codigoAplicado,
    descuentoCodigo,
    total,
    ordenes,
    cargandoOrdenes,
    panelAbierto,
    abrirPanel: () => setPanelAbierto(true),
    cerrarPanel: () => setPanelAbierto(false),
    obtenerStockRestante,
    agregarAlCarrito,
    cambiarCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
    aplicarCodigo,
    quitarCodigo,
    generarOrden,
    recargarOrdenes: cargarOrdenes,
  }

  return <TiendaContext.Provider value={value}>{children}</TiendaContext.Provider>
}

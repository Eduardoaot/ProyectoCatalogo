import { useEffect, useMemo, useRef, useState } from 'react'
import { buscarCodigo, CODIGOS_DESCUENTO } from '../data/descuentos'
import { PRODUCTOS } from '../data/productos'
import { useAuth } from './AuthContext'
import { TiendaContext } from './TiendaContext'

// -----------------------------------------------------------------------
// Stock: productos.js no trae un campo "stock" propio (es un archivo que
// se sigue editando a mano con los productos del catálogo), así que aquí
// se define un stock inicial por defecto para todos los productos. Si en
// el futuro un producto necesita un stock distinto, basta con agregarle
// un campo `stock: <numero>` en productos.js y este contexto lo respeta.
// -----------------------------------------------------------------------
const STOCK_POR_DEFECTO = 30

// El carrito, las órdenes y el código aplicado se guardan por usuario
// (clave = su id, o "invitado" si no hay sesión) para que cada quien vea
// solo lo suyo. El stock vendido es global: es el mismo inventario para
// todos los usuarios.
const INVITADO = 'invitado'
const CLAVE_STOCK_VENDIDO = 'rosamark:stockVendido'
const claveCarrito = (id) => `rosamark:carrito:${id}`
const claveOrdenes = (id) => `rosamark:ordenes:${id}`
const claveCodigo = (id) => `rosamark:codigo:${id}`

function leerLocalStorage(clave, valorPorDefecto) {
  try {
    const guardado = localStorage.getItem(clave)
    return guardado ? JSON.parse(guardado) : valorPorDefecto
  } catch {
    return valorPorDefecto
  }
}

// Stock que de verdad queda disponible para un producto: el stock base
// menos lo que ya se descontó en órdenes generadas anteriormente.
function calcularStockRestante(productoId, stockVendido) {
  const producto = PRODUCTOS.find((item) => item.id === productoId)
  const stockBase = producto?.stock ?? STOCK_POR_DEFECTO
  const vendido = stockVendido[productoId] ?? 0
  return Math.max(0, stockBase - vendido)
}

// Suma las cantidades de dos carritos (mismo producto = se combinan),
// sin pasarse nunca del stock restante de cada producto.
function fusionarCarritos(base, extra, stockVendido) {
  const resultado = base.map((item) => ({ ...item }))
  extra.forEach((itemExtra) => {
    const stockRestante = calcularStockRestante(itemExtra.productoId, stockVendido)
    const indice = resultado.findIndex((item) => item.productoId === itemExtra.productoId)
    if (indice >= 0) {
      resultado[indice].cantidad = Math.min(
        resultado[indice].cantidad + itemExtra.cantidad,
        stockRestante,
      )
    } else {
      resultado.push({
        productoId: itemExtra.productoId,
        cantidad: Math.min(itemExtra.cantidad, stockRestante),
      })
    }
  })
  return resultado
}

export function TiendaProvider({ children }) {
  const { usuario } = useAuth()
  const idActual = usuario?.id ?? INVITADO

  const [carrito, setCarrito] = useState(() => leerLocalStorage(claveCarrito(idActual), []))
  const [ordenes, setOrdenes] = useState(() => leerLocalStorage(claveOrdenes(idActual), []))
  const [codigoAplicado, setCodigoAplicado] = useState(() =>
    leerLocalStorage(claveCodigo(idActual), null),
  )
  const [stockVendido, setStockVendido] = useState(() =>
    leerLocalStorage(CLAVE_STOCK_VENDIDO, {}),
  )
  const [panelAbierto, setPanelAbierto] = useState(false)

  const idAnteriorRef = useRef(idActual)

  // Al iniciar sesión, registrarse o cerrar sesión cambia el "dueño" del
  // carrito. Si se venía de invitado, su carrito se fusiona con el del
  // usuario que acaba de entrar (no se pierde nada al loguearse). Si se
  // cierra sesión, simplemente se vuelve a ver el carrito de invitado
  // (el del usuario queda guardado para la próxima vez que inicie sesión).
  useEffect(() => {
    if (idAnteriorRef.current === idActual) return
    const idAnterior = idAnteriorRef.current
    idAnteriorRef.current = idActual

    const carritoDestino = leerLocalStorage(claveCarrito(idActual), [])

    if (idAnterior === INVITADO && idActual !== INVITADO) {
      const carritoInvitado = leerLocalStorage(claveCarrito(INVITADO), [])
      const fusionado = fusionarCarritos(carritoDestino, carritoInvitado, stockVendido)
      localStorage.setItem(claveCarrito(idActual), JSON.stringify(fusionado))
      localStorage.removeItem(claveCarrito(INVITADO))
      setCarrito(fusionado)
    } else {
      setCarrito(carritoDestino)
    }

    setOrdenes(leerLocalStorage(claveOrdenes(idActual), []))
    setCodigoAplicado(leerLocalStorage(claveCodigo(idActual), null))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idActual])

  useEffect(() => {
    localStorage.setItem(claveCarrito(idActual), JSON.stringify(carrito))
  }, [carrito, idActual])

  useEffect(() => {
    localStorage.setItem(claveOrdenes(idActual), JSON.stringify(ordenes))
  }, [ordenes, idActual])

  useEffect(() => {
    if (codigoAplicado) {
      localStorage.setItem(claveCodigo(idActual), JSON.stringify(codigoAplicado))
    } else {
      localStorage.removeItem(claveCodigo(idActual))
    }
  }, [codigoAplicado, idActual])

  useEffect(() => {
    localStorage.setItem(CLAVE_STOCK_VENDIDO, JSON.stringify(stockVendido))
  }, [stockVendido])

  const obtenerStockRestante = (productoId) => calcularStockRestante(productoId, stockVendido)

  // Agrega `cantidad` unidades de un producto al carrito (sin pasarse del
  // stock restante) y abre el panel lateral de carrito.
  const agregarAlCarrito = (producto, cantidad = 1) => {
    const stockRestante = calcularStockRestante(producto.id, stockVendido)
    setCarrito((actual) => {
      const existente = actual.find((item) => item.productoId === producto.id)
      const cantidadPrevia = existente?.cantidad ?? 0
      const nuevaCantidad = Math.min(cantidadPrevia + cantidad, stockRestante)
      if (nuevaCantidad <= 0) return actual
      if (existente) {
        return actual.map((item) =>
          item.productoId === producto.id ? { ...item, cantidad: nuevaCantidad } : item,
        )
      }
      return [...actual, { productoId: producto.id, cantidad: nuevaCantidad }]
    })
    setPanelAbierto(true)
  }

  // delta positivo aumenta, negativo disminuye; si llega a 0 se quita del carrito.
  const cambiarCantidad = (productoId, delta) => {
    const stockRestante = calcularStockRestante(productoId, stockVendido)
    setCarrito((actual) =>
      actual
        .map((item) => {
          if (item.productoId !== productoId) return item
          const nuevaCantidad = Math.min(Math.max(item.cantidad + delta, 0), stockRestante)
          return { ...item, cantidad: nuevaCantidad }
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

  const aplicarCodigo = (texto) => {
    const encontrado = buscarCodigo(texto)
    if (!encontrado) {
      return { ok: false, error: 'Ese código no existe o ya expiró.' }
    }
    setCodigoAplicado(encontrado.codigo)
    return { ok: true }
  }

  const quitarCodigo = () => setCodigoAplicado(null)

  // Carrito "enriquecido" con los datos del producto y el stock restante,
  // listo para pintar en el panel lateral y en la página del carrito.
  const carritoConDetalle = useMemo(
    () =>
      carrito
        .map((item) => {
          const producto = PRODUCTOS.find((p) => p.id === item.productoId)
          if (!producto) return null
          return {
            ...item,
            producto,
            stockRestante: calcularStockRestante(item.productoId, stockVendido),
          }
        })
        .filter(Boolean),
    [carrito, stockVendido],
  )

  // Desglose de precios: precio de lista (por si el producto ya trae su
  // propio descuento vía `precioOriginal`) -> subtotal real -> descuento
  // por código aplicado -> total.
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

  const codigoInfo = useMemo(
    () => CODIGOS_DESCUENTO.find((c) => c.codigo === codigoAplicado) ?? null,
    [codigoAplicado],
  )
  const descuentoCodigo = useMemo(
    () => (codigoInfo ? codigoInfo.calcularDescuento(carritoConDetalle) : 0),
    [codigoInfo, carritoConDetalle],
  )

  const total = Math.max(0, subtotal - descuentoCodigo)
  const totalUnidades = useMemo(
    () => carritoConDetalle.reduce((acc, item) => acc + item.cantidad, 0),
    [carritoConDetalle],
  )

  // Convierte el carrito actual en una orden: descuenta el stock vendido
  // de forma permanente y vacía el carrito (y el código aplicado).
  const generarOrden = () => {
    if (carritoConDetalle.length === 0) return null

    const orden = {
      id: Date.now(),
      fecha: new Date().toISOString(),
      items: carritoConDetalle.map((item) => ({
        productoId: item.productoId,
        nombre: item.producto.nombre,
        precio: item.producto.precio,
        cantidad: item.cantidad,
      })),
      subtotalLista,
      descuentoProductos,
      descuentoCodigo,
      codigo: codigoInfo?.etiqueta ?? null,
      total,
    }

    setStockVendido((actual) => {
      const nuevo = { ...actual }
      carritoConDetalle.forEach((item) => {
        nuevo[item.productoId] = (nuevo[item.productoId] ?? 0) + item.cantidad
      })
      return nuevo
    })
    setOrdenes((actual) => [orden, ...actual])
    setCarrito([])
    setCodigoAplicado(null)

    return orden
  }

  const value = {
    carrito: carritoConDetalle,
    totalUnidades,
    subtotalLista,
    subtotal,
    descuentoProductos,
    codigoAplicado: codigoInfo,
    descuentoCodigo,
    total,
    ordenes,
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
  }

  return <TiendaContext.Provider value={value}>{children}</TiendaContext.Provider>
}

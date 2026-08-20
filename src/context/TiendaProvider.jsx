import { useEffect, useMemo, useState } from 'react'
import { PRODUCTOS } from '../data/productos'
import { TiendaContext } from './TiendaContext'

// -----------------------------------------------------------------------
// Stock: productos.js no trae un campo "stock" propio (es un archivo que
// se sigue editando a mano con los productos del catálogo), así que aquí
// se define un stock inicial por defecto para todos los productos. Si en
// el futuro un producto necesita un stock distinto, basta con agregarle
// un campo `stock: <numero>` en productos.js y este contexto lo respeta.
// -----------------------------------------------------------------------
const STOCK_POR_DEFECTO = 30

const CLAVE_CARRITO = 'rosamark:carrito'
const CLAVE_ORDENES = 'rosamark:ordenes'
const CLAVE_STOCK_VENDIDO = 'rosamark:stockVendido'

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

export function TiendaProvider({ children }) {
  const [carrito, setCarrito] = useState(() => leerLocalStorage(CLAVE_CARRITO, []))
  const [ordenes, setOrdenes] = useState(() => leerLocalStorage(CLAVE_ORDENES, []))
  const [stockVendido, setStockVendido] = useState(() =>
    leerLocalStorage(CLAVE_STOCK_VENDIDO, {}),
  )

  useEffect(() => {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito))
  }, [carrito])

  useEffect(() => {
    localStorage.setItem(CLAVE_ORDENES, JSON.stringify(ordenes))
  }, [ordenes])

  useEffect(() => {
    localStorage.setItem(CLAVE_STOCK_VENDIDO, JSON.stringify(stockVendido))
  }, [stockVendido])

  const obtenerStockRestante = (productoId) => calcularStockRestante(productoId, stockVendido)

  // Agrega `cantidad` unidades de un producto al carrito, sin pasarse
  // nunca del stock restante disponible.
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

  // Carrito "enriquecido" con los datos del producto y el stock restante,
  // listo para pintar en la página del carrito.
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

  const subtotal = useMemo(
    () => carritoConDetalle.reduce((acc, item) => acc + item.producto.precio * item.cantidad, 0),
    [carritoConDetalle],
  )
  const total = subtotal
  const totalUnidades = useMemo(
    () => carritoConDetalle.reduce((acc, item) => acc + item.cantidad, 0),
    [carritoConDetalle],
  )

  // Convierte el carrito actual en una orden: descuenta el stock vendido
  // de forma permanente y vacía el carrito.
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

    return orden
  }

  const value = {
    carrito: carritoConDetalle,
    totalUnidades,
    subtotal,
    total,
    ordenes,
    obtenerStockRestante,
    agregarAlCarrito,
    cambiarCantidad,
    eliminarDelCarrito,
    generarOrden,
  }

  return <TiendaContext.Provider value={value}>{children}</TiendaContext.Provider>
}

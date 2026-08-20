import { useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Footer from './layout/Footer'
import Navbar from './layout/Navbar'
import PanelCarrito from './layout/PanelCarrito'
import SparkleBackground from './layout/SparkleBackground'
import SplashScreen from './layout/SplashScreen'
import Carrito from './modulos/Carrito/Carrito'
import Cuenta from './modulos/Cuenta/Cuenta'
import Home from './modulos/Home/Home'
import Login from './modulos/Login/Login'
import Ordenes from './modulos/Ordenes/Ordenes'
import ProductoDetalle from './modulos/ProductoDetalle/ProductoDetalle'
import './App.css'

function App() {
  const [mostrarSplash, setMostrarSplash] = useState(true)
  const location = useLocation()

  return (
    <>
      {mostrarSplash && <SplashScreen onFinish={() => setMostrarSplash(false)} />}
      <SparkleBackground />
      <PanelCarrito />
      <div className="app-contenido">
        <Navbar />
        {/* La key con la ruta actual hace que React vuelva a montar este bloque
            en cada navegación, disparando la animación de fade definida en App.css.
            El Navbar queda fuera de este bloque para no verse afectado. */}
        <div key={location.pathname} className="page-transicion">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/producto/:id" element={<ProductoDetalle />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cuenta" element={<Cuenta />} />
            <Route path="/ordenes" element={<Ordenes />} />
            <Route path="/carrito" element={<Carrito />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </>
  )
}

export default App

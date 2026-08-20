import { useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import SparkleBackground from './components/SparkleBackground'
import SplashScreen from './components/SplashScreen'
import Carrito from './pages/Carrito'
import Cuenta from './pages/Cuenta'
import Home from './pages/Home'
import Login from './pages/Login'
import Ordenes from './pages/Ordenes'
import ProductoDetalle from './pages/ProductoDetalle'
import './App.css'

function App() {
  const [mostrarSplash, setMostrarSplash] = useState(true)
  const location = useLocation()

  return (
    <>
      {mostrarSplash && <SplashScreen onFinish={() => setMostrarSplash(false)} />}
      <SparkleBackground />
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
      </div>
    </>
  )
}

export default App

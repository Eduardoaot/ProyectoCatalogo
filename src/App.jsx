import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import SparkleBackground from './components/SparkleBackground'
import Home from './pages/Home'
import ProductoDetalle from './pages/ProductoDetalle'
import './App.css'

function App() {
  return (
    <>
      <SparkleBackground />
      <div className="app-contenido">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/producto/:id" element={<ProductoDetalle />} />
        </Routes>
      </div>
    </>
  )
}

export default App

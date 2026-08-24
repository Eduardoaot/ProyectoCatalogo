import { Link } from 'react-router-dom'
import rosaLogo from '../assets/RosaLogo.webp'
import { CATEGORIAS } from '../data/productos'
import './Footer.css'

const ANIO_ACTUAL = new Date().getFullYear()

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__marca">
          <Link to="/" className="footer__brand">
            <img className="footer__logo" src={rosaLogo} alt="" />
            <span className="footer__brand-texto">Rosamark</span>
          </Link>
          <p className="footer__eslogan">
            Tu supermercado de confianza: frescura, ofertas y todo lo que necesitas para tu
            hogar, a un clic de distancia.
          </p>
        </div>

        <div className="footer__columna">
          <h4>Catálogo</h4>
          <Link to="/">Todos los productos</Link>
          {CATEGORIAS.slice(0, 4).map((categoria) => (
            <Link key={categoria} to={`/?categoria=${encodeURIComponent(categoria)}`}>
              {categoria}
            </Link>
          ))}
        </div>

        <div className="footer__columna">
          <h4>Mi cuenta</h4>
          <Link to="/cuenta">Mi cuenta</Link>
          <Link to="/ordenes">Mis órdenes</Link>
          <Link to="/carrito">Carrito</Link>
          <Link to="/login">Iniciar sesión</Link>
        </div>

        <div className="footer__columna">
          <h4>Códigos de descuento</h4>
          <span className="footer__codigo">FRESCUERA — 20% en frutas y verduras</span>
          <span className="footer__codigo">LLEVATEUNAVACA — 2x1 en lácteos</span>
        </div>
      </div>

      <div className="footer__pie">
        <span>© {ANIO_ACTUAL} Rosamark. Proyecto educativo, no es una tienda real.</span>
      </div>
    </footer>
  )
}

export default Footer

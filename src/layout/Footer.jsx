import { Link } from 'react-router-dom'
import rosaLogo from '../assets/RosaLogo.webp'
import { useCatalogo } from '../context/CatalogoContext'
import './Footer.css'

const ANIO_ACTUAL = new Date().getFullYear()

function Footer() {
  const { categorias, codigos } = useCatalogo()

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
          {categorias.slice(0, 4).map((categoria) => (
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
          {codigos.map((codigo) => (
            <span key={codigo.texto} className="footer__codigo">
              {codigo.texto} — {codigo.descripcion}
            </span>
          ))}
        </div>
      </div>

      <div className="footer__pie">
        <span>© {ANIO_ACTUAL} Rosamark. Proyecto educativo, no es una tienda real.</span>
      </div>
    </footer>
  )
}

export default Footer

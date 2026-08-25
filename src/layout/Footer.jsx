import { Link } from 'react-router-dom'
import LogoRosa from '../assets/LogoRosa.png'
import LogoLetras from '../assets/LogoLetras.png'
import { useCatalogo } from '../context/CatalogoContext'
import { usePreferencias } from '../context/PreferenciasContext'
import './Footer.css'

const ANIO_ACTUAL = new Date().getFullYear()

function Footer() {
  const { categorias, codigos } = useCatalogo()
  const { t } = usePreferencias()

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__marca">
          <Link to="/" className="footer__brand">
            <img className="footer__logo" src={LogoRosa} alt="" />
            <img className="footer__brand-texto" src={LogoLetras} alt="Rosamark" />
          </Link>
          <p className="footer__eslogan">{t('footer.eslogan')}</p>
        </div>

        <div className="footer__columna">
          <h4>{t('footer.catalogo')}</h4>
          <Link to="/">{t('footer.todosProductos')}</Link>
          {categorias.slice(0, 4).map((categoria) => (
            <Link key={categoria} to={`/?categoria=${encodeURIComponent(categoria)}`}>
              {t(`cat.${categoria}`)}
            </Link>
          ))}
        </div>

        <div className="footer__columna">
          <h4>{t('footer.miCuenta')}</h4>
          <Link to="/cuenta">{t('footer.miCuenta')}</Link>
          <Link to="/ordenes">{t('menu.misOrdenes')}</Link>
          <Link to="/carrito">{t('nav.carrito')}</Link>
          <Link to="/favoritos">{t('nav.favoritos')}</Link>
          <Link to="/login">{t('nav.iniciarSesion')}</Link>
        </div>

        <div className="footer__columna">
          <h4>{t('footer.codigos')}</h4>
          {codigos.map((codigo) => (
            <span key={codigo.texto} className="footer__codigo">
              {codigo.texto} — {codigo.descripcion}
            </span>
          ))}
        </div>
      </div>

      <div className="footer__pie">
        <span>{t('footer.derechos', { anio: ANIO_ACTUAL })}</span>
      </div>
    </footer>
  )
}

export default Footer

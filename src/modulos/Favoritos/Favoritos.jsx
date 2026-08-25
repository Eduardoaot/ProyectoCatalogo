import { Link } from 'react-router-dom'
import ProductCard from '../Home/componentes/ProductCard'
import { useAuth } from '../../context/AuthContext'
import { useFavoritos } from '../../context/FavoritosContext'
import { usePreferencias } from '../../context/PreferenciasContext'
import './Favoritos.css'

// Apartado de favoritos: misma grilla y misma tarjeta que el catálogo
// (ProductCard ya trae su propio botón de corazón para quitar/agregar). Los
// favoritos viven en la tabla `Favoritos` de MySQL, así que hacen falta
// sesión — a diferencia del carrito, que sí acepta invitado.
function Favoritos() {
  const { usuario } = useAuth()
  const { favoritos, total, cargando } = useFavoritos()
  const { t } = usePreferencias()

  return (
    <section className="favoritos">
      <h1>{t('fav.titulo')}</h1>

      {!usuario ? (
        <div className="favoritos__vacio">
          <p>{t('fav.necesitaSesion')}</p>
          <Link to="/login" state={{ from: '/favoritos' }} className="favoritos__volver">
            {t('login.iniciar')}
          </Link>
        </div>
      ) : cargando ? (
        <p className="favoritos__cargando">{t('fav.cargando')}</p>
      ) : favoritos.length === 0 ? (
        <div className="favoritos__vacio">
          <p>{t('fav.vacio')}</p>
          <p className="favoritos__vacio-ayuda">{t('fav.vacioAyuda')}</p>
          <Link to="/" className="favoritos__volver">
            {t('home.titulo')}
          </Link>
        </div>
      ) : (
        <>
          <p className="favoritos__total">{t('fav.total', { n: total })}</p>
          <div className="favoritos__grid">
            {favoritos.map((producto) => (
              <ProductCard key={producto.id} producto={producto} />
            ))}
          </div>
        </>
      )}
    </section>
  )
}

export default Favoritos

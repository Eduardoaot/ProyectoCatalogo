import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Carousel from './componentes/Carousel'
import ProductCard from './componentes/ProductCard'
import { usePreferencias } from '../../context/PreferenciasContext'
import { useCatalogo } from '../../context/CatalogoContext'
import ICONOS_CATEGORIAS from '../../data/iconos'
import { IconoChevron } from '../../common/iconos'
import './Home.css'

const DURACION_TRANSICION_MS = 200

function Home() {
  const { productos, categorias, cargando, error, reintentar } = useCatalogo()
  const { t } = usePreferencias()
  // La URL es la única fuente de verdad del filtro: ?categoria=... permite
  // que el dropdown del menú lateral enlace directo a un filtro aplicado,
  // y ?buscar=... conecta la barra de búsqueda del navbar.
  const [searchParams, setSearchParams] = useSearchParams()
  const categoriaActiva = searchParams.get('categoria') || 'Todas'
  const busqueda = searchParams.get('buscar') || ''

  const [transicionando, setTransicionando] = useState(false)
  // Ancla de scroll: tanto una búsqueda nueva como un cambio de categoría
  // llevan la vista hasta acá (el título "Catálogo Rosamark"), nunca más
  // abajo ni más arriba, sin importar cuánto cambie de alto la grilla.
  const introRef = useRef(null)

  // Los tres botones principales son independientes entre sí: "Categorías"
  // solo abre/cierra la sub-barra (no filtra nada por sí sola, para eso ya
  // está categoriaActiva); "En oferta" y "Tendencias" sí filtran, y pueden
  // estar los dos activos a la vez (y junto con una categoría), para poder
  // pedir p. ej. "verduras en oferta destacadas".
  const [categoriasAbiertas, setCategoriasAbiertas] = useState(false)
  const [filtroOferta, setFiltroOferta] = useState(false)
  const [filtroTendencias, setFiltroTendencias] = useState(false)

  // Una búsqueda nueva reinicia los filtros (categoría incluida, que ya se
  // limpia sola porque el buscador del navbar reemplaza toda la URL): a
  // partir de ahí el usuario vuelve a combinarlos como quiera sobre esos
  // resultados.
  const busquedaAnteriorRef = useRef(busqueda)
  useEffect(() => {
    if (busquedaAnteriorRef.current === busqueda) return
    busquedaAnteriorRef.current = busqueda
    setFiltroOferta(false)
    setFiltroTendencias(false)
  }, [busqueda])

  // Rango de precio del panel lateral. Arranca en los límites reales del
  // catálogo (no en un número inventado) y los sigue mientras el usuario no
  // haya tocado el slider, así una recarga con precios distintos no deja el
  // filtro pegado a un rango viejo.
  const limitesPrecio = useMemo(() => {
    if (productos.length === 0) return { min: 0, max: 0 }
    const precios = productos.map((producto) => producto.precio)
    return { min: Math.floor(Math.min(...precios)), max: Math.ceil(Math.max(...precios)) }
  }, [productos])
  // Min y max viven en UN solo estado (no dos aparte) a propósito: así cada
  // ajuste lee y corrige los dos números en la misma actualización, con el
  // valor más fresco que tenga React en ese momento — nunca el de un cierre
  // (closure) que quedó desactualizado por el render en el que se creó.
  const [rangoPrecio, setRangoPrecio] = useState(null) // null = sigue los límites del catálogo
  const precioMinActivo = rangoPrecio?.min ?? limitesPrecio.min
  const precioMaxActivo = rangoPrecio?.max ?? limitesPrecio.max
  const cambiarPrecioMin = (e) => {
    const valor = Number(e.target.value)
    setRangoPrecio((actual) => {
      const max = actual?.max ?? limitesPrecio.max
      const tope = Math.max(limitesPrecio.min, max - 1)
      return { min: Math.min(Math.max(valor, limitesPrecio.min), tope), max }
    })
  }
  const cambiarPrecioMax = (e) => {
    const valor = Number(e.target.value)
    setRangoPrecio((actual) => {
      const min = actual?.min ?? limitesPrecio.min
      const piso = Math.min(limitesPrecio.max, min + 1)
      return { min, max: Math.max(Math.min(valor, limitesPrecio.max), piso) }
    })
  }

  // Los campos de texto del rango de precio se editan aparte del valor
  // "comprometido" (precioMinActivo/precioMaxActivo): así se puede borrar el
  // campo y escribir un número nuevo de varias cifras sin que se rellene solo
  // en cada tecla. Se validan y se aplican al perder el foco (o con Enter),
  // igual que la cantidad en el detalle de producto.
  //
  // Cuando el valor comprometido cambia por fuera del campo (el slider, o el
  // catálogo recién cargado) el texto se resincroniza — ajustando el estado
  // durante el render, no en un efecto, así no dispara un renderizado extra.
  const [textoPrecioMin, setTextoPrecioMin] = useState(String(precioMinActivo))
  const [precioMinSincronizado, setPrecioMinSincronizado] = useState(precioMinActivo)
  if (precioMinActivo !== precioMinSincronizado) {
    setPrecioMinSincronizado(precioMinActivo)
    setTextoPrecioMin(String(precioMinActivo))
  }
  const [textoPrecioMax, setTextoPrecioMax] = useState(String(precioMaxActivo))
  const [precioMaxSincronizado, setPrecioMaxSincronizado] = useState(precioMaxActivo)
  if (precioMaxActivo !== precioMaxSincronizado) {
    setPrecioMaxSincronizado(precioMaxActivo)
    setTextoPrecioMax(String(precioMaxActivo))
  }
  // El precio del filtro es siempre entero (igual que cualquier cantidad
  // fuera del kilogramo, ver data/unidades.js): el campo descarta cualquier
  // caracter que no sea dígito apenas se escribe, así nunca se cuela una
  // letra, una coma, un signo ni un decimal.
  const soloDigitos = (valor) => valor.replace(/[^0-9]/g, '')

  const confirmarPrecioMinTexto = () => {
    const numero = Number(textoPrecioMin)
    setRangoPrecio((actual) => {
      const max = actual?.max ?? limitesPrecio.max
      const actualMin = actual?.min ?? limitesPrecio.min
      const base = textoPrecioMin !== '' && Number.isFinite(numero) ? numero : actualMin
      // Nunca por debajo del producto más barato, y nunca a la par o por
      // encima del máximo actual — el rango no se puede invertir.
      const tope = Math.max(limitesPrecio.min, max - 1)
      return { min: Math.min(Math.max(base, limitesPrecio.min), tope), max }
    })
  }
  const confirmarPrecioMaxTexto = () => {
    const numero = Number(textoPrecioMax)
    setRangoPrecio((actual) => {
      const min = actual?.min ?? limitesPrecio.min
      const actualMax = actual?.max ?? limitesPrecio.max
      const base = textoPrecioMax !== '' && Number.isFinite(numero) ? numero : actualMax
      // Nunca por encima del producto más caro (si escriben más, cae justo en
      // ese máximo) y nunca a la par o por debajo del mínimo actual.
      const piso = Math.min(limitesPrecio.max, min + 1)
      return { min, max: Math.max(Math.min(base, limitesPrecio.max), piso) }
    })
  }
  // Enter confirma sin esperar a que el campo pierda el foco (dispara el
  // onBlur de arriba).
  const confirmarConEnter = (e) => {
    if (e.key === 'Enter') e.currentTarget.blur()
  }

  // Orden del catálogo: los dos dropdowns (nombre y precio) recuerdan cada
  // uno su propia opción, pero solo uno manda a la vez — el que se tocó por
  // última vez, igual que el modo del carrito en TiendaProvider.
  const [ordenDropdownAbierto, setOrdenDropdownAbierto] = useState(false)
  const [precioDropdownAbierto, setPrecioDropdownAbierto] = useState(false)
  const [ordenNombre, setOrdenNombre] = useState('az')
  const [ordenPrecio, setOrdenPrecio] = useState('asc')
  const [criterioOrden, setCriterioOrden] = useState('nombre')
  const elegirOrdenNombre = (valor) => {
    setOrdenNombre(valor)
    setCriterioOrden('nombre')
    setOrdenDropdownAbierto(false)
  }
  const elegirOrdenPrecio = (valor) => {
    setOrdenPrecio(valor)
    setCriterioOrden('precio')
    setPrecioDropdownAbierto(false)
  }

  // Compara por nombre y por precio en las direcciones elegidas ahora mismo
  // en cada dropdown (aunque ese criterio no sea el principal): así el que
  // no manda igual sirve de desempate en vez de perderse del todo.
  const compararPorNombre = useCallback(
    (a, b) =>
      ordenNombre === 'za'
        ? b.nombre.localeCompare(a.nombre, 'es')
        : a.nombre.localeCompare(b.nombre, 'es'),
    [ordenNombre],
  )
  const compararPorPrecio = useCallback(
    (a, b) => (ordenPrecio === 'asc' ? a.precio - b.precio : b.precio - a.precio),
    [ordenPrecio],
  )

  // La categoría y la búsqueda se combinan: los filtros de categoría se
  // aplican sobre los resultados de búsqueda (y viceversa), no se
  // reemplazan entre sí. "En oferta", "Tendencias" y el rango de precio se
  // suman de la misma forma — todos a la vez si hace falta — y el orden se
  // aplica al final sobre lo que haya quedado.
  const productosFiltrados = useMemo(() => {
    let lista = productos
    if (categoriaActiva !== 'Todas') {
      lista = lista.filter((producto) => producto.categoria === categoriaActiva)
    }
    if (busqueda) {
      const texto = busqueda.toLowerCase()
      lista = lista.filter((producto) => producto.nombre.toLowerCase().includes(texto))
    }
    if (filtroOferta) {
      lista = lista.filter((producto) => producto.precioOriginal > producto.precio)
    }
    if (filtroTendencias) {
      lista = lista.filter((producto) => producto.destacado)
    }
    lista = lista.filter(
      (producto) => producto.precio >= precioMinActivo && producto.precio <= precioMaxActivo,
    )
    // El criterio tocado por última vez manda; el otro (con la dirección que
    // tenga elegida en su propio dropdown en este momento) desempata cuando
    // el primero da lo mismo — p. ej. dos productos al mismo precio caen por
    // orden alfabético en la dirección que esté elegida ahí.
    return [...lista].sort((a, b) => {
      if (criterioOrden === 'precio') {
        const diferencia = compararPorPrecio(a, b)
        return diferencia !== 0 ? diferencia : compararPorNombre(a, b)
      }
      const diferencia = compararPorNombre(a, b)
      return diferencia !== 0 ? diferencia : compararPorPrecio(a, b)
    })
  }, [
    productos,
    categoriaActiva,
    busqueda,
    filtroOferta,
    filtroTendencias,
    precioMinActivo,
    precioMaxActivo,
    criterioOrden,
    compararPorNombre,
    compararPorPrecio,
  ])

  // Lleva la vista al título del catálogo después de filtrar (búsqueda del
  // navbar o botón de categoría), en vez de dejar al usuario arriba del todo
  // tapado por el carrusel.
  //
  // No se usa scrollIntoView a propósito: al filtrar, la grilla se queda con
  // muchos menos productos y la página entera se vuelve más baja. Si el
  // destino calculado ya no existe, el navegador recorta el scroll hasta el
  // final del documento — y el usuario terminaba mirando el footer con los
  // resultados por encima. Se mide a mano y, si no se llega, se vuelve
  // directamente arriba (con una página tan corta igual se ve todo).
  const irAlCatalogo = useCallback(() => {
    // En el frame siguiente: para entonces la grilla nueva ya está en el DOM
    // y getBoundingClientRect devuelve la posición definitiva, no la vieja.
    requestAnimationFrame(() => {
      const intro = introRef.current
      if (!intro) return
      const navbarAlto =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue('--navbar-alto'),
        ) || 0
      const destino = intro.getBoundingClientRect().top + window.scrollY - navbarAlto - 12
      const maximo = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
      window.scrollTo({
        top: destino > maximo ? 0 : Math.max(0, destino),
        behavior: 'smooth',
      })
    })
  }, [])

  // Se dispara con el filtro ya aplicado (no al hacer clic), así la medición
  // de arriba ve la altura real de la página. En la primera carga solo se
  // mueve si la URL ya traía un filtro; si no, se respeta el arranque arriba.
  const primeraVez = useRef(true)
  useEffect(() => {
    if (cargando) return
    if (primeraVez.current) {
      primeraVez.current = false
      if (!busqueda && categoriaActiva === 'Todas') return
    }
    irAlCatalogo()
  }, [busqueda, categoriaActiva, cargando, irAlCatalogo])

  // Al cambiar de categoría desde los botones de filtro, primero se
  // desvanece la grilla (fade out) y, una vez invisible, se actualiza la
  // URL (lo que a su vez cambia productosFiltrados) y vuelve a aparecer.
  //
  // El scroll no se dispara acá sino en el efecto de arriba, cuando la
  // grilla nueva ya está montada: hacerlo antes significaba medir la página
  // vieja y acabar en una posición que ya no existía.
  const cambiarCategoria = (categoria, boton) => {
    if (categoria === categoriaActiva) return
    // Sin esto, el navegador intenta mantener visible el botón recién
    // enfocado y "pelea" con nuestro scroll hacia el título de arriba.
    boton?.blur()
    setTransicionando(true)
    setTimeout(() => {
      const params = new URLSearchParams(searchParams)
      if (categoria === 'Todas') {
        params.delete('categoria')
      } else {
        params.set('categoria', categoria)
      }
      setSearchParams(params)
      setTransicionando(false)
    }, DURACION_TRANSICION_MS)
  }

  // null = eslogan por defecto (con su segunda línea); si hay búsqueda o
  // categoría activa, se muestra ese mensaje en su lugar.
  let mensajeIntro = null
  if (busqueda && categoriaActiva !== 'Todas') {
    mensajeIntro = t('home.resultadosEn', { texto: busqueda, categoria: t(`cat.${categoriaActiva}`) })
  } else if (busqueda) {
    mensajeIntro = t('home.resultadosPara', { texto: busqueda })
  } else if (categoriaActiva !== 'Todas') {
    mensajeIntro = t('home.categoria', { categoria: t(`cat.${categoriaActiva}`) })
  }

  // El catálogo viene de la API, así que hay dos estados nuevos que antes no
  // existían: mientras carga, y cuando el backend no responde.
  if (error) {
    return (
      <section className="home home--aviso">
        <h1>{t('home.errorTitulo')}</h1>
        <p className="home__error">{error}</p>
        <button type="button" className="filtro" onClick={reintentar}>
          {t('home.reintentar')}
        </button>
      </section>
    )
  }

  if (cargando) {
    return (
      <section className="home home--aviso">
        <h1>{t('home.titulo')}</h1>
        <p>{t('home.cargando')}</p>
      </section>
    )
  }

  return (
    <section className="home">
      <Carousel />

      <div className="home__intro" ref={introRef}>
        <h1 className="home__intro-titulo">{t('home.titulo')}</h1>
        <p className="home__intro-eslogan">
          <span className="home__intro-eslogan-punto" aria-hidden="true" />
          {mensajeIntro ?? t('home.eslogan')}
        </p>
        {!mensajeIntro && <p className="home__intro-eslogan2">{t('home.eslogan2')}</p>}
      </div>

      <div className="home__filtros-principales">
        <button
          type="button"
          className={categoriasAbiertas ? 'home__filtro-boton is-active' : 'home__filtro-boton'}
          aria-expanded={categoriasAbiertas}
          onClick={() => setCategoriasAbiertas((abierto) => !abierto)}
        >
          {t('home.filtroCategorias')}
          <IconoChevron className={categoriasAbiertas ? 'home__flecha is-activa' : 'home__flecha'} />
        </button>
        <button
          type="button"
          className={filtroOferta ? 'home__filtro-boton is-active' : 'home__filtro-boton'}
          aria-pressed={filtroOferta}
          onClick={() => setFiltroOferta((activo) => !activo)}
        >
          {t('home.filtroOferta')}
        </button>
        <button
          type="button"
          className={filtroTendencias ? 'home__filtro-boton is-active' : 'home__filtro-boton'}
          aria-pressed={filtroTendencias}
          onClick={() => setFiltroTendencias((activo) => !activo)}
        >
          {t('home.filtroTendencias')}
        </button>
      </div>

      {/* Sub-barra de categorías: se despliega solo con el botón "Categorías"
          de arriba, en vez de ocupar siempre una fila entera. Sigue siendo
          un filtro más — se combina con "En oferta"/"Tendencias", no los
          reemplaza. */}
      <div className={categoriasAbiertas ? 'home__categorias-wrapper is-open' : 'home__categorias-wrapper'}>
        <div className="home__categorias-inner">
          <div className="home__categorias">
            <button
              type="button"
              className={categoriaActiva === 'Todas' ? 'home__categoria-boton is-active' : 'home__categoria-boton'}
              onClick={(e) => cambiarCategoria('Todas', e.currentTarget)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true">
                <path d="M183.5-183.5Q160-207 160-240t23.5-56.5Q207-320 240-320t56.5 23.5Q320-273 320-240t-23.5 56.5Q273-160 240-160t-56.5-23.5Zm240 0Q400-207 400-240t23.5-56.5Q447-320 480-320t56.5 23.5Q560-273 560-240t-23.5 56.5Q513-160 480-160t-56.5-23.5Zm240 0Q640-207 640-240t23.5-56.5Q687-320 720-320t56.5 23.5Q800-273 800-240t-23.5 56.5Q753-160 720-160t-56.5-23.5Zm-480-240Q160-447 160-480t23.5-56.5Q207-560 240-560t56.5 23.5Q320-513 320-480t-23.5 56.5Q273-400 240-400t-56.5-23.5Zm240 0Q400-447 400-480t23.5-56.5Q447-560 480-560t56.5 23.5Q560-513 560-480t-23.5 56.5Q513-400 480-400t-56.5-23.5Zm240 0Q640-447 640-480t23.5-56.5Q687-560 720-560t56.5 23.5Q800-513 800-480t-23.5 56.5Q753-400 720-400t-56.5-23.5Zm-480-240Q160-687 160-720t23.5-56.5Q207-800 240-800t56.5 23.5Q320-753 320-720t-23.5 56.5Q273-640 240-640t-56.5-23.5Zm240 0Q400-687 400-720t23.5-56.5Q447-800 480-800t56.5 23.5Q560-753 560-720t-23.5 56.5Q513-640 480-640t-56.5-23.5Zm240 0Q640-687 640-720t23.5-56.5Q687-800 720-800t56.5 23.5Q800-753 800-720t-23.5 56.5Q753-640 720-640t-56.5-23.5Z" />
              </svg>
              <span>{t('home.todas')}</span>
            </button>
            {categorias.map((categoria) => (
              <button
                key={categoria}
                type="button"
                className={categoriaActiva === categoria ? 'home__categoria-boton is-active' : 'home__categoria-boton'}
                onClick={(e) => cambiarCategoria(categoria, e.currentTarget)}
              >
                {ICONOS_CATEGORIAS[categoria]}
                <span>{t(`cat.${categoria}`)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {productosFiltrados.length === 0 ? (
        <p className="home__sin-resultados">{t('home.sinResultados')}</p>
      ) : (
        <div className="home__catalogo">
          <aside className="home__panel" aria-label={t('home.ordenarPor')}>
            <div className="home__panel-card">
              <h3 className="home__panel-titulo">{t('home.rangoPrecio')}</h3>
              <div className="home__panel-precio-info font-outfit">
                <label className="home__precio-campo">
                  $
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="home__precio-input"
                    value={textoPrecioMin}
                    onChange={(e) => setTextoPrecioMin(soloDigitos(e.target.value))}
                    onBlur={confirmarPrecioMinTexto}
                    onKeyDown={confirmarConEnter}
                    aria-label={t('home.precioMinimo')}
                  />
                </label>
                <label className="home__precio-campo">
                  $
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="home__precio-input"
                    value={textoPrecioMax}
                    onChange={(e) => setTextoPrecioMax(soloDigitos(e.target.value))}
                    onBlur={confirmarPrecioMaxTexto}
                    onKeyDown={confirmarConEnter}
                    aria-label={t('home.precioMaximo')}
                  />
                </label>
              </div>
              <div className="home__slider-doble">
                <div className="home__slider-pista" />
                <div
                  className="home__slider-progreso"
                  style={{
                    left: `${((precioMinActivo - limitesPrecio.min) / (limitesPrecio.max - limitesPrecio.min || 1)) * 100}%`,
                    width: `${((precioMaxActivo - precioMinActivo) / (limitesPrecio.max - limitesPrecio.min || 1)) * 100}%`,
                  }}
                />
                <input
                  type="range"
                  min={limitesPrecio.min}
                  max={limitesPrecio.max}
                  value={precioMinActivo}
                  onChange={cambiarPrecioMin}
                  className="home__slider-input"
                  aria-label={t('home.precioMinimo')}
                />
                <input
                  type="range"
                  min={limitesPrecio.min}
                  max={limitesPrecio.max}
                  value={precioMaxActivo}
                  onChange={cambiarPrecioMax}
                  className="home__slider-input"
                  aria-label={t('home.precioMaximo')}
                />
              </div>
            </div>

            <p className="home__panel-subtitulo">{t('home.ordenarPor')}</p>

            <div className="home__panel-card home__panel-card--fila">
              <span className="home__panel-etiqueta">{t('home.nombre')}</span>
              <div className="home__dropdown">
                <button
                  type="button"
                  className="home__dropdown-boton"
                  aria-expanded={ordenDropdownAbierto}
                  onClick={() => setOrdenDropdownAbierto((abierto) => !abierto)}
                >
                  {ordenNombre === 'az' ? t('home.ordenAZ') : t('home.ordenZA')}
                  <IconoChevron className={ordenDropdownAbierto ? 'home__flecha is-activa' : 'home__flecha'} />
                </button>
                <div className={ordenDropdownAbierto ? 'home__dropdown-menu is-open' : 'home__dropdown-menu'}>
                  <button
                    type="button"
                    className={
                      criterioOrden === 'nombre' && ordenNombre === 'az'
                        ? 'home__dropdown-item is-selected'
                        : 'home__dropdown-item'
                    }
                    onClick={() => elegirOrdenNombre('az')}
                  >
                    {t('home.ordenAZ')}
                  </button>
                  <button
                    type="button"
                    className={
                      criterioOrden === 'nombre' && ordenNombre === 'za'
                        ? 'home__dropdown-item is-selected'
                        : 'home__dropdown-item'
                    }
                    onClick={() => elegirOrdenNombre('za')}
                  >
                    {t('home.ordenZA')}
                  </button>
                </div>
              </div>
            </div>

            <div className="home__panel-card home__panel-card--fila">
              <span className="home__panel-etiqueta">{t('home.precio')}</span>
              <div className="home__dropdown">
                <button
                  type="button"
                  className="home__dropdown-boton"
                  aria-expanded={precioDropdownAbierto}
                  onClick={() => setPrecioDropdownAbierto((abierto) => !abierto)}
                >
                  {ordenPrecio === 'asc' ? t('home.precioMenorMayor') : t('home.precioMayorMenor')}
                  <IconoChevron className={precioDropdownAbierto ? 'home__flecha is-activa' : 'home__flecha'} />
                </button>
                <div className={precioDropdownAbierto ? 'home__dropdown-menu is-open' : 'home__dropdown-menu'}>
                  <button
                    type="button"
                    className={
                      criterioOrden === 'precio' && ordenPrecio === 'asc'
                        ? 'home__dropdown-item is-selected'
                        : 'home__dropdown-item'
                    }
                    onClick={() => elegirOrdenPrecio('asc')}
                  >
                    {t('home.precioMenorMayor')}
                  </button>
                  <button
                    type="button"
                    className={
                      criterioOrden === 'precio' && ordenPrecio === 'desc'
                        ? 'home__dropdown-item is-selected'
                        : 'home__dropdown-item'
                    }
                    onClick={() => elegirOrdenPrecio('desc')}
                  >
                    {t('home.precioMayorMenor')}
                  </button>
                </div>
              </div>
            </div>
          </aside>

          <div className={transicionando ? 'home__grid home__grid--transicion' : 'home__grid'}>
            {productosFiltrados.map((producto) => (
              <ProductCard key={producto.id} producto={producto} />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

export default Home

import { useEffect, useState } from 'react'
import rosaLogo from '../assets/RosaLogo.webp'
import './SplashScreen.css'

const DURACION_VISIBLE_MS = 1600
const DURACION_SALIDA_MS = 500

// Pantalla de bienvenida que se muestra una vez al cargar la app:
// aparece el logo + "Rosamark" y luego se desvanece para revelar el catálogo.
function SplashScreen({ onFinish }) {
  const [saliendo, setSaliendo] = useState(false)

  useEffect(() => {
    const salirTimer = setTimeout(() => setSaliendo(true), DURACION_VISIBLE_MS)
    const finTimer = setTimeout(() => onFinish(), DURACION_VISIBLE_MS + DURACION_SALIDA_MS)

    return () => {
      clearTimeout(salirTimer)
      clearTimeout(finTimer)
    }
  }, [onFinish])

  return (
    <div className={saliendo ? 'splash splash--saliendo' : 'splash'}>
      <img className="splash__logo" src={rosaLogo} alt="" />
      <span className="splash__texto">Rosamark</span>
    </div>
  )
}

export default SplashScreen

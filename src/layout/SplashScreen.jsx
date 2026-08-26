import { useEffect, useState } from 'react'
import LogoRosa from '../assets/LogoRosa.png'
import LogoLetras from '../assets/LogoLetras.png'
import './SplashScreen.css'

// El texto termina de subir a los 0.3s + 0.9s = 1.2s; se deja visible un
// rato más (hasta 1900ms) para que la animación se note y no se sienta
// como que el logo "aparece" de golpe.
const DURACION_VISIBLE_MS = 1900
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
      <img className="splash__logo" src={LogoRosa} alt="" />
      <img className="splash__texto" src={LogoLetras} alt="Rosamark" />
    </div>
  )
}

export default SplashScreen

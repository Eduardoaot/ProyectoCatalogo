import { useState } from 'react'
import { usePreferencias } from '../context/PreferenciasContext'
import { IconoOjo, IconoOjoTachado } from './iconos'
import './CampoPassword.css'

// Input de contraseña reutilizable con botón de mostrar/ocultar (mismo ojo
// en Login y en el formulario de cambio de contraseña de Cuenta). No revela
// ninguna contraseña guardada — el servidor solo la tiene hasheada y nunca
// la devuelve — solo alterna lo que la persona está escribiendo ahora mismo.
function CampoPassword({ id, label, value, onChange, placeholder = '••••••••', autoComplete, required }) {
  const { t } = usePreferencias()
  const [visible, setVisible] = useState(false)

  return (
    <label className="campo-password" htmlFor={id}>
      {label}
      <div className="campo-password__fila">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
        />
        <button
          type="button"
          className="campo-password__ojo"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? t('login.ocultar') : t('login.mostrar')}
          tabIndex={-1}
        >
          {visible ? (
            <IconoOjoTachado className="campo-password__icono" />
          ) : (
            <IconoOjo className="campo-password__icono" />
          )}
        </button>
      </div>
    </label>
  )
}

export default CampoPassword

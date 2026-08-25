import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'
import { CatalogoProvider } from './context/CatalogoProvider'
import { TiendaProvider } from './context/TiendaProvider'
import './index.css'
import App from './App.jsx'

// El orden importa: TiendaProvider lee la sesión (Auth) y el catálogo
// (Catalogo), así que ambos tienen que envolverlo.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CatalogoProvider>
          <TiendaProvider>
            <App />
          </TiendaProvider>
        </CatalogoProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)

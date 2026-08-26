import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'
import { CatalogoProvider } from './context/CatalogoProvider'
import { FavoritosProvider } from './context/FavoritosProvider'
import { PreferenciasProvider } from './context/PreferenciasProvider'
import { TiendaProvider } from './context/TiendaProvider'
import './index.css'
import App from './App.jsx'

// El orden importa: Preferencias no depende de nada (va afuera de todo).
// TiendaProvider y FavoritosProvider leen la sesión (Auth) y/o el catálogo
// (Catalogo), así que ambos tienen que envolverlos.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <PreferenciasProvider>
        <AuthProvider>
          <CatalogoProvider>
            <FavoritosProvider>
              <TiendaProvider>
                <App />
              </TiendaProvider>
            </FavoritosProvider>
          </CatalogoProvider>
        </AuthProvider>
      </PreferenciasProvider>
    </BrowserRouter>
  </StrictMode>,
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'
import { TiendaProvider } from './context/TiendaProvider'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <TiendaProvider>
          <App />
        </TiendaProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)

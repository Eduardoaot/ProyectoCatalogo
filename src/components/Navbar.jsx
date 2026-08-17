import { NavLink } from 'react-router-dom'
import rosaLogo from '../assets/RosaLogo.webp'
import './Navbar.css'

function Navbar() {
  return (
    <header className="navbar">
      <NavLink to="/" className="navbar__brand">
        <img className="navbar__logo" src={rosaLogo} alt="" />
        <span className="navbar__brand-texto">Rosamark</span>
      </NavLink>
      <nav className="navbar__links">
        <NavLink
          to="/"
          end
          className={({ isActive }) => (isActive ? 'navbar__link is-active' : 'navbar__link')}
        >
          Catálogo
        </NavLink>
      </nav>
    </header>
  )
}

export default Navbar

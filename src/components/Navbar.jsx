import { NavLink } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  return (
    <header className="navbar">
      <NavLink to="/" className="navbar__brand">
        <span className="navbar__logo" aria-hidden="true">🌸</span>
        Rosamark
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

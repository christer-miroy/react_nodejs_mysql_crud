import { NavLink } from 'react-router-dom'
import './navbar.style.css'

const Navbar = () => {
  return (
    <div className="navbar">
        <h3>React + NodeJS + MySQL CRUD with Image</h3>
        <div className="links">
            <NavLink activeclassname="active-link" className="link" to="/">Home</NavLink>
            <NavLink activeclassname="active-link" className="link" to="/add">Add Listing</NavLink>
        </div>
    </div>
  )
}
export default Navbar
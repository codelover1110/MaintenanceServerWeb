import React from 'react';
import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <div>
      <nav className="mb-1 navbar navbar-expand-lg navbar-dark shop-navbar">
        <div className="container">
          <div className="navbar-container">
            <ul className="navbar-nav mr-auto">
              <li>
                <a href="/"><img src="/src/assets/maintenance_logo.png" className="logo-image" /></a>
              </li>
              <li style={{ marginLeft: '60px' }}>
                <NavLink to="/adminuser" className="nav-item nav-link">Admin User</NavLink>
              </li>
              <li>
                <NavLink to="/metadata_main" className="nav-item nav-link">Meta Data</NavLink>
              </li>
              <li>
                <NavLink to="/maintenance" className="nav-item nav-link">Maintenance</NavLink>
              </li>
              <li>
                <NavLink to="/location" className="nav-item nav-link">Location</NavLink>
              </li>
              <li>
                <NavLink to="/active-log" className="nav-item nav-link">Activity Log</NavLink>
              </li>
              <li>
                <NavLink to="/reportlistpage" className="nav-item nav-link">Report List</NavLink>
              </li>
              <li className="btn-report">
                <NavLink to="/report"><i className="fa prefix white-text">Deleted Reports</i></NavLink>
              </li>
              <li className="btn-log">
                <a href="/login"><i className="fa fa-lock prefix white-text"> -Log Out</i></a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="maintenance-container">
        <div className="navbar-wrap">
          <ul className="navbar-ul">
            <li>
              <a href="/"><img src="/src/assets/maintenance_logo.png" className="logo-image" /></a>
            </li>
            <li style={{ marginLeft: '60px' }}>
              <NavLink to="/adminuser" className="nav-item-link">Admin User</NavLink>
            </li>
            <li>
              <NavLink to="/metadata_main" className="nav-item-link">Meta Data</NavLink>
            </li>
            <li>
              <NavLink to="/maintenance" className="nav-item-link">Maintenance</NavLink>
            </li>
            <li>
              <NavLink to="/location" className="nav-item-link">Location</NavLink>
            </li>
            <li>
              <NavLink to="/active-log" className="nav-item-link">Activity Log</NavLink>
            </li>
            <li className="btn-logout">
              <a href="/login"><i className="fa fa-lock prefix white-text"> -Log Out</i></a>
            </li>
          </ul>
        </div>
      </div>
    </div>

  )
}

export { Navbar };
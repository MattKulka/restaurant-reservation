import React from "react";

import { Link } from "react-router-dom";

/**
 * Defines the menu for this application.
 *
 * @returns {JSX.Element}
 */

function Menu() {
  return (
    <nav className="menu navbar navbar-dark align-items-start p-0">
      <div className="menu container-fluid d-flex flex-column p-0">
        <Link
          className="navbar-brand d-flex justify-content-center align-items-center sidebar-brand m-0"
          to="/"
        >
          <div className="menu sidebar-brand-text mx-3">
            <span className="menu">Periodic Tables</span>
          </div>
        </Link>
        <hr className="menu sidebar-divider my-0" />
        <ul className="menu nav navbar-nav text-light" id="accordionSidebar">
          <li className="menu nav-item">
            <Link className="nav-link" to="/dashboard">
              <span className="menu oi oi-dashboard" />
              &nbsp;Dashboard
            </Link>
          </li>
          <li className="menu nav-item">
            <Link className="nav-link" to="/search">
              <span className="menu oi oi-magnifying-glass" />
              &nbsp;Search
            </Link>
          </li>
          <li className="menu nav-item">
            <Link className="menu nav-link" to="/reservations/new">
              <span className="menu oi oi-plus" />
              &nbsp;New Reservation
            </Link>
          </li>
          <li className="menu nav-item">
            <Link className="nav-link" to="/tables/new">
              <span className="menu oi oi-layers" />
              &nbsp;New Table
            </Link>
          </li>
        </ul>
        <div className="menu text-center d-none d-md-inline">
          <button
            className="menu btn rounded-circle border-0"
            id="sidebarToggle"
            type="button"
          />
        </div>
      </div>
    </nav>
  );
}

export default Menu;

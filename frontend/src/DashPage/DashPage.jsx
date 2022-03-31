import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import image1 from '../assets/a.png';
import image3 from '../assets/c.png';
import image4 from '../assets/d.png';

function DashPage() {
  return (
    <div className="dashboard-container">
      <div className="phone-images">
        <NavLink to="/metadata_main" className="nav-item nav-link">
          <div className="dashboard-item-container">
            <div className="dashborad-title">
              <div className="dashborad-title-content">
                <p className="dashboard-title-text">MetaData</p>
              </div>
            </div>
            <div className="item-image-container">
              <img src={image1} className="phone-image-a" />
            </div>
          </div>
        </NavLink>
        <NavLink to="/maintenance" className="nav-item nav-link">
          <div className="dashboard-item-container">
            <div className="dashborad-title">
              <div className="dashborad-title-content">
                <p className="dashboard-title-text">Maintenance</p>
              </div>
            </div>
            <div className="item-image-container">
              <img src={image3} className="phone-image-a" />
            </div>
          </div>
        </NavLink>
        <NavLink to="/location" className="nav-item nav-link">
          <div className="dashboard-item-container">
            <div className="dashborad-title">
              <div className="dashborad-title-content">
                <p className="dashboard-title-text">Location</p>
              </div>
            </div>
            <div className="item-image-container">
              <img src={image4} className="phone-image" />
            </div>
          </div>
        </NavLink>
      </div>
    </div>
  );
}

export { DashPage };
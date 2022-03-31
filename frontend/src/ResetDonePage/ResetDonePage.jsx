import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function ResetDonePage() {
  return (
    <div className="auth">
      <div className="card autentication-container">
        <div className="card-body">
        <p className="h4 text-center py-4">Email sent successful.</p>

        <div className="d-flex align-items-center justify-content-center mb-4">
            <div className="col-md-1 col-md-4 d-flex align-items-start">
              <div className="text-center">
              <Link to="/login">
                <button type="submit" className="btn btn-grey btn-rounded z-depth-1a">
                  Login
                </button>
              </Link>
              </div>
            </div>

            <div className="col-md-8">
              <Link to="/reset">
                <p className="font-small grey-text d-flex justify-content-end mt-3">  <button type="submit" className="btn btn-grey btn-rounded z-depth-1a justify-content-end ml-2">
                  Back </button> </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}

export { ResetDonePage };
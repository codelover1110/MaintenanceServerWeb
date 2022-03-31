import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { userActions } from '../_actions';
const queryString = require('query-string');




function ResetPassword() {
  const [inputs, setInputs] = useState({
    username: '',
    password: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const { username, password } = inputs;
  const loggingIn = useSelector(state => state.authentication.loggingIn);
  const dispatch = useDispatch();

  // progress login status
  const [isSubmitting, setIssubmitting] = useState(false);
  const delay = (ms) => new Promise(resolve =>
    setTimeout(resolve, ms)
  );

  const params = queryString.parse(useLocation().search)
  let id = params.id


  // reset login status
  useEffect(() => {
    dispatch(userActions.check_resetID(id));
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setInputs(inputs => ({ ...inputs, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    if (username && password) {
      if (username == password) {
        setIssubmitting(true);
        dispatch(userActions.resetpasswrd(password, id));

        delay(5000).then(() => {
          setIssubmitting(false);
        });
      } else {
        alert("Confirmpassword is not same password")
      }


    }
  }
  return (
    <div className="auth">
      <div className="card autentication-container">
        <div className="card-body">
          <form name="form" onSubmit={handleSubmit}>
            <p className="h4 text-center py-4">Reset Password.</p>
            <div className="md-form">
              <i className="fa fa-lock prefix grey-text"></i>
              <input type="password" name="username" value={username} onChange={handleChange} className={'form-control' + (submitted && !username ? ' is-invalid' : '')} placeholder="password" />
              {submitted && !username &&
                <div className="invalid-feedback">password is required</div>
              }
            </div>
            <div className="md-form">
              <i className="fa fa-lock prefix grey-text"></i>
              <input type="password" name="password" value={password} onChange={handleChange} className={'form-control' + (submitted && !password ? ' is-invalid' : '')} placeholder="confirm password" />
              {submitted && !password &&
                <div className="invalid-feedback">confirm password is required</div>
              }
            </div>
            <div className="d-flex align-items-center justify-content-center mb-4">
              <div>
                <div className="text-center">
                  <button type="submit" className="btn btn-grey btn-rounded z-depth-1a" disabled={isSubmitting}>
                    Reset
                    {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                  </button>
                </div>
              </div>
              <div>
                <Link to="/login">
                  <p className="font-small grey-text d-flex justify-content-end mt-3">  <button type="submit" className="btn btn-grey btn-rounded z-depth-1a justify-content-end ml-2">
                    Cancel
                  </button> </p>
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div >
  );
}

export { ResetPassword };
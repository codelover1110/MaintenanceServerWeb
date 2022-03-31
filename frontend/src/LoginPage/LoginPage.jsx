import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { userActions } from '../_actions';

function LoginPage() {
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


  // reset login status
  useEffect(() => {
    dispatch(userActions.logout());
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setInputs(inputs => ({ ...inputs, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    setSubmitted(true);
    if (username && password) {
      setIssubmitting(true);
      dispatch(userActions.login(username, password));
      
    delay(5000).then(() => {
      setIssubmitting(false);
    });
     
    }
  }

  return (
    <div className="auth">
      <div className="card autentication-container">
        <div className="card-body">
          <form name="form" onSubmit={handleSubmit}>
            <p className="h4 text-center py-4">LOGIN</p>
            <div className="md-form">
              <i className="fa fa-user prefix grey-text"></i>
              <input type="text" name="username" value={username} onChange={handleChange} className={'form-control' + (submitted && !username ? ' is-invalid' : '')} placeholder="Username" />
              {submitted && !username &&
                <div className="invalid-feedback">Username is required</div>
              }
            </div>
            <div className="md-form">
              <i className="fa fa-lock prefix grey-text"></i>
              <input type="password" name="password" value={password} onChange={handleChange} className={'form-control' + (submitted && !password ? ' is-invalid' : '')} placeholder="Password" />
              {submitted && !password &&
                <div className="invalid-feedback">Password is required</div>
              }
            </div>
            <div className="row d-flex align-items-center mb-4">

              <div className="col-md-1 col-md-4 d-flex align-items-start">
                <div className="text-center">
                  <button type="submit" className="btn btn-grey btn-rounded z-depth-1a" disabled={isSubmitting}>
                    Log in
                    {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                  </button>
                </div>
              </div>

              <div>
                <Link to="/reset">
                  <p className="font-small grey-text d-flex justify-content-end mt-3">  <button type="submit" className="btn btn-grey btn-rounded z-depth-1a justify-content-end ml-2">
                    Reset
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

export { LoginPage };
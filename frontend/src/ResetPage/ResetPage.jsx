import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { userActions } from '../_actions';

function ResetPage() {
  const [inputs, setInputs] = useState({
    user_email: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const { user_email } = inputs;
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
    if (user_email) {
      setIssubmitting(true);
      dispatch(userActions.reset(user_email));

      delay(15000).then(() => {
        setIssubmitting(false);
      });
    }
  }

  return (
    <div className="auth">
      <div className="card autentication-container">
        <div className="card-body">
          <form name="form" onSubmit={handleSubmit}>
            <p className="h4 text-center py-4">Email Address</p>
            <div className="md-form">
              <i className="fa fa-user prefix grey-text"></i>
              <input type="email" name="user_email" value={user_email} onChange={handleChange} className={'form-control' + (submitted && !user_email ? ' is-invalid' : '')} placeholder="Email Address" required />
              {submitted && !user_email &&
                <div className="invalid-feedback">Email Address is required</div>
              }
            </div>
            <div className="d-flex align-items-center justify-content-center mb-4">
              <div className="col-md-1 col-md-4 d-flex align-items-start">
                <div className="text-center">
                  <button type="submit" className="btn btn-grey btn-rounded z-depth-1a" disabled={isSubmitting}>
                    Reset
                    {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                  </button>
                </div>
              </div>

              <div className="col-md-8">
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

export { ResetPage };
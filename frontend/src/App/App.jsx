import React, { useEffect } from 'react';
import { Router, Route, Switch, Redirect, HashRouter, BrowserRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createBrowserHistory } from 'history';

// import { history } from '../_helpers';
import { alertActions } from '../_actions';
import { PrivateRoute } from '../_components';
import { HomePage } from '../HomePage';
import { LoginPage } from '../LoginPage';
import { RegisterPage } from '../RegisterPage';
import { ResetPage } from '../ResetPage';
import { ResetDonePage } from '../ResetDonePage';
import { ResetPassword } from '../ResetPassword';
import { Navbar } from '../Navbar';
import style from './App.css';
import logo from './logo.svg';


function App() {
    const alert = useSelector(state => state.alert);
    const dispatch = useDispatch();

    useEffect(() => {
        // history.listen((location, action) => {
        //     // clear alert on location change
        //     dispatch(alertActions.clear());
        // });
    }, []);

    const history = createBrowserHistory({
        forceRefresh: true
    });

    return (
        <div className="jumbotron11" >
            <div className="container">
                <div className="">
                    {alert.message &&
                        <div className={`alert ${alert.type}`}>{alert.message}</div>
                    }
                    <BrowserRouter history={history}>
                        <Switch>
                            <PrivateRoute exact path="/" component={HomePage} />
                            <Route path="/login" component={LoginPage} />
                            <Route path="/register" component={RegisterPage} />
                            <Route path="/reset" component={ResetPage} />
                            <Route path="/resetdone" component={ResetDonePage} />
                            <Route path="/resetpassword" component={ResetPassword} />
                            <Redirect from="*" to="/" />
                        </Switch>
                    </BrowserRouter>
                </div>
            </div>
        </div>
    );
}

export {App};
import { userConstants } from '../_constants';
import { userService } from '../_services';
import { alertActions } from './';
// import { history } from '../_helpers';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router'
import { createBrowserHistory } from 'history';

export const userActions = {
    login,
    logout,
    register,
    getAll,
    delete: _delete,
    reset,
    check_resetID,
    resetpasswrd,
};
const history = createBrowserHistory({
    forceRefresh: true
});

function login(username, password) {
    return dispatch => {
        dispatch(request({ username }));

        userService.login(username, password)
            .then(
                user => {
                    if (user.user_name && user.password) {
                        dispatch(success(user));
                        history.push('/');
                    } else {
                        if (user.Authority == "false") {
                            dispatch(alertActions.error("You can't log in right now. Please request an administrator."));
                        } else {
                            dispatch(alertActions.error("Invalid Value. Try again.!"));
                        }
                        return "ok";
                    }
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(user) { return { type: userConstants.LOGIN_REQUEST, user } }

    function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } }

    function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}

function logout() {
    userService.logout();
    return { type: userConstants.LOGOUT };
}

function register(user) {
    return dispatch => {
        dispatch(request(user));

        userService.register(user)
            .then(
                user => {
                    dispatch(success());
                    history.push('/login');
                    dispatch(alertActions.success('Registration successful'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(user) { return { type: userConstants.REGISTER_REQUEST, user } }

    function success(user) { return { type: userConstants.REGISTER_SUCCESS, user } }

    function failure(error) { return { type: userConstants.REGISTER_FAILURE, error } }
}

function getAll() {
    return dispatch => {
        dispatch(request());

        userService.getAll()
            .then(
                users => dispatch(success(users)),
                error => dispatch(failure(error.toString()))
            );
        // console.log(users)
    };

    function request() { return { type: userConstants.GETALL_REQUEST } }

    function success(users) { return { type: userConstants.GETALL_SUCCESS, users } }

    function failure(error) { return { type: userConstants.GETALL_FAILURE, error } }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    return dispatch => {
        dispatch(request(id));

        userService.delete(id)
            .then(
                user => {
                    console.log(user)
                    if (user.success == 'true') {
                        dispatch(success(id))
                    } else {
                        error => dispatch(failure(id, error.toString()))
                    }
                }
            );
    };

    function request(id) { return { type: userConstants.DELETE_REQUEST, id } }

    function success(id) { return { type: userConstants.DELETE_SUCCESS, id } }

    function failure(id, error) { return { type: userConstants.DELETE_FAILURE, id, error } }
}



function reset(user_email) {
    return dispatch => {
        dispatch(request(user_email));

        userService.reset(user_email)
            .then(
                user => {
                    dispatch(success());
                    if (user.email == '') {
                        dispatch(alertActions.error('Invaild Email'));
                    } else {
                        console.log(user)
                        history.push('/resetdone');
                        dispatch(alertActions.success('Email sent successful'));
                    }

                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(user) { return { type: userConstants.REGISTER_REQUEST, user } }

    function success(user) { return { type: userConstants.REGISTER_SUCCESS, user } }

    function failure(error) { return { type: userConstants.REGISTER_FAILURE, error } }
}

const delay = (ms) => new Promise(resolve =>
    setTimeout(resolve, ms)
  );

function check_resetID(id) {
    return dispatch => {
        dispatch(request(id));

        userService.check_resetID(id)
            .then(
                user => {
                    dispatch(success());
                    if (user.reset_id == '') {
                        dispatch(alertActions.error('Invaild reset Password. Try again.'));
                        delay(1500).then(() => {
                            history.push('reset');
                        });
                    } else {
                        console.log(user)
                    }

                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(user) { return { type: userConstants.REGISTER_REQUEST, user } }

    function success(user) { return { type: userConstants.REGISTER_SUCCESS, user } }

    function failure(error) { return { type: userConstants.REGISTER_FAILURE, error } }
}


function resetpasswrd(user_email, reset_id) {
    return dispatch => {
        dispatch(request(user_email));

        userService.resetpasswrd(user_email, reset_id)
            .then(
                user => {
                    dispatch(success());
                    if (user.reset_id == '') {
                        dispatch(alertActions.error('Failed reset password'));
                    } else {
                        console.log(user)
                        history.push('/login');
                        dispatch(alertActions.success('Reset password successful'));
                    }

                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(user) { return { type: userConstants.REGISTER_REQUEST, user } }

    function success(user) { return { type: userConstants.REGISTER_SUCCESS, user } }

    function failure(error) { return { type: userConstants.REGISTER_FAILURE, error } }
}

import { userConstants } from '../_constants';
import { customerService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';

export const customerAction = {
    login,
    logout,
    register,
    getAll,
    delete: _delete
};

function login(username, password) {
    return dispatch => {
        dispatch(request({ username }));

        customerService.login(username, password)
            .then(
                user => {
                    if (user.user_name && user.password) {
                        dispatch(success(user));
                        history.push('/');
                    } else {
                        dispatch(alertActions.error("Invalid Value. Try again.!"));
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
    customerService.logout();
    return { type: userConstants.LOGOUT };
}

function register(user) {
    return dispatch => {
        dispatch(request(user));

        customerService.register(user)
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

        customerService.getAll()
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

        customerService.delete(id)
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
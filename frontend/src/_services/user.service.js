import config from 'config';
import { authHeader } from '../_helpers';
import { fetchWrapper } from '../_helpers/fetch-wrapper';


export const userService = {
    login,
    logout,
    register,
    getAll,
    getById,
    update,
    delete: _delete,
    create,
    getUser,
    updateUser,
    reset,
    check_resetID,
    resetpasswrd,
    getTechnicalCatetory
};

function login(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    };

    return fetch('http://13.80.147.178:8082/getadminuser/', requestOptions)
        .then(handleResponse)
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('username', username)

            return user;
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
    localStorage.removeItem('username');
}

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch('http://13.80.147.178:8082/getadminusers/', requestOptions)
        .then(handleResponse);
}

function getById(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/users/${id}`, requestOptions).then(handleResponse);
}

function register(user) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };


    return fetch('http://13.80.147.178:8082/addadminuser/', requestOptions).then(handleResponse);

}

function update(user) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return fetch(`${config.apiUrl}/users/${user.id}`, requestOptions).then(handleResponse);;
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    };

    // return fetch(`${config.apiUrl}/users/${id}`, requestOptions)
    return fetch('http://13.80.147.178:8082/deleteadminuser/'+ id, requestOptions)
        .then(handleResponse)


    // .then(handleResponse);
    // .then(res => console.log(res))
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
                location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}


function create(params) {
    return fetchWrapper.post('http://13.80.147.178:8082/createUser/', params);
}

function updateUser(id, params) {
    return fetchWrapper.post(`http://13.80.147.178:8082/updateUser/${id}`, params);
}


function getUser(id) {
    return fetchWrapper.get(`http://13.80.147.178:8082/getUser/${id}`);
}


function reset(user_email) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user_email)
    };


    return fetch('http://13.80.147.178:8082/resetEmail/', requestOptions).then(handleResponse);

}


function check_resetID(reset_id) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reset_id)
    };


    return fetch('http://13.80.147.178:8082/checkResetID/', requestOptions).then(handleResponse);

}

function resetpasswrd(user_email, reset_id) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({user_email, reset_id})
    };


    return fetch('http://13.80.147.178:8082/resetPassword/', requestOptions).then(handleResponse);

}


function getTechnicalCatetory() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch('http://13.80.147.178:8082/getTechnicalCatergory/', requestOptions)
        .then(handleResponse);
}

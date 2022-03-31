import config from 'config';
import { fetchWrapper } from '../_helpers/fetch-wrapper';

const baseUrl = `${config.apiUrl}/users`;

export const consumptionService = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    getRemarkAll,
};

function getAll() {
    return fetchWrapper.get('http://13.80.147.178:8082/getConsumptions');
}

function getById(id) {
    return fetchWrapper.get(`http://13.80.147.178:8082/editConsumption/${id}`);
}

function create(params) {
    return fetchWrapper.post('http://13.80.147.178:8082/createConsumption/', params);
}

function update(id, params) {
    return fetchWrapper.post(`http://13.80.147.178:8082/updateConsumption/${id}`, params);
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(id) {
    return fetchWrapper.delete(`http://13.80.147.178:8082/deleteConsumption/${id}`);
}

function getRemarkAll() {
    return fetchWrapper.get('http://13.80.147.178:8082/getRemarks');
}
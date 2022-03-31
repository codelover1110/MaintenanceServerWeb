import config from 'config';
import { fetchWrapper } from '../_helpers/fetch-wrapper';

const baseUrl = `${config.apiUrl}/users`;

export const metadataService = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    getConsumptionData,
    getActiveLog,
    getActiveDataAll,
};

function getAll() {
    return fetchWrapper.get('http://13.80.147.178:8082/getMetaDatas');
}

function getById(id) {
    return fetchWrapper.get(`http://13.80.147.178:8082/editMetaData/${id}`);
}

function create(params) {
    return fetchWrapper.post('http://13.80.147.178:8082/createMetaData/', params);
}

function update(id, params) {
    return fetchWrapper.post(`http://13.80.147.178:8082/updateMetaData/${id}`, params);
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(id) {
    return fetchWrapper.delete(`http://13.80.147.178:8082/deleteMetaData/${id}`);
}



function getConsumptionData(id) {
    return fetchWrapper.get(`http://13.80.147.178:8082/getConsumptionData/${id}`);
}

function getActiveLog(id, page) {
    // return fetchWrapper.get(`http://13.80.147.178:8082/getActiveLog/${id}`);
    return fetchWrapper.post(`http://13.80.147.178:8082/getActiveLog/${id}`, page);
}


function getActiveDataAll() {
    return fetchWrapper.get('http://13.80.147.178:8082/getActiveDataAll');
}

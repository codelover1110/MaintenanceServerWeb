import config from 'config';
import { fetchWrapper } from '../_helpers/fetch-wrapper';

const baseUrl = `${config.apiUrl}/users`;

export const metadataService = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    deleteReportdata: deleteReportdata,
    getMetaActivity,
    getAllArchive,
    getMaintenance,
    getUser,
    getActiveLog,
    getActiveDataAll,
    uploadReport,
    getAllReport
};

function getAll() {
    return fetchWrapper.get('http://13.80.147.178:8082/getMetaMainDatas');
}

function getAllReport() {
    return fetchWrapper.get('http://13.80.147.178:8082/getAllReport');
}

function getAllArchive() {
    return fetchWrapper.get('http://13.80.147.178:8082/getMetaArchiveDatas');
}

function getById(id) {
    return fetchWrapper.get(`http://13.80.147.178:8082/editMetaMainData/${id}`);
}

function create(params) {
    return fetchWrapper.post('http://13.80.147.178:8082/createMetaMainData/', params);
}

function uploadReport(params) {
    return fetchWrapper.post('http://13.80.147.178:8082/uploadReport/', params);
}

function update(id, params) {
    return fetchWrapper.post(`http://13.80.147.178:8082/updateMetaMainData/${id}`, params);
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(id, by_user) {
    return fetchWrapper.delete(`http://13.80.147.178:8082/deleteMetaMainData/${id}/${by_user}`);
}

function deleteReportdata(id, flag) {
    return fetchWrapper.post(`http://13.80.147.178:8082/deleteReportdata/${id}/${flag}`);
}



function getMetaActivity(id) {
    return fetchWrapper.get(`http://13.80.147.178:8082/getMetaActivity/${id}`);
}



function getMaintenance() {
    return fetchWrapper.get(`http://13.80.147.178:8082/getMaintenance`);
}


function getUser(id) {
    return fetchWrapper.get(`http://13.80.147.178:8082/getUserByID/${id}`);
}

function getActiveLog(id, page) {
    // return fetchWrapper.get(`http://13.80.147.178:8082/getActiveLog/${id}`);
    return fetchWrapper.post(`http://13.80.147.178:8082/getActiveLog/${id}`, page);
}


function getActiveDataAll() {
    return fetchWrapper.get('http://13.80.147.178:8082/getActiveDataAll');
}

import { api } from "../utils/requester.js";

const endPoints = {
    getAll: "/protocols",
};

async function getAllProtocols(signal) {
    return await api.get(endPoints.getAll, signal);
}

async function getProtocolById(id, signal) {
    return await api.get(`${endPoints.getAll}/${id}`, signal);
}

async function createProtocol(data) {
    return await api.post(endPoints.getAll, data);
}

async function editProtocolById(id, data) {
    return await api.put(`${endPoints.getAll}/${id}`, data);
}

async function deleteProtocolById(id) {
    return await api.del(`${endPoints.getAll}/${id}`);
}

export const protocolServices = {
    getAllProtocols,
    getProtocolById,
    createProtocol,
    editProtocolById,
    deleteProtocolById,
};

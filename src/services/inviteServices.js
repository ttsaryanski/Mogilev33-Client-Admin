import { api } from "../utils/requester.js";

const endPoints = {
    getAll: "/invitations",
};

async function getAllInvitations(signal) {
    return await api.get(endPoints.getAll, signal);
}

async function getInviteById(id, signal) {
    return await api.get(`${endPoints.getAll}/${id}`, signal);
}

async function createInvite(data) {
    return await api.post(endPoints.getAll, data);
}

async function editInviteById(id, data) {
    return await api.put(`${endPoints.getAll}/${id}`, data);
}

async function deleteInviteById(id) {
    return await api.del(`${endPoints.getAll}/${id}`);
}

export const inviteServices = {
    getAllInvitations,
    getInviteById,
    createInvite,
    editInviteById,
    deleteInviteById,
};

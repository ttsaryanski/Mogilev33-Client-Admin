import { api } from "../utils/requester.js";

const endPoints = {
    getAll: "/offers",
};

async function getAllOffers(signal) {
    return await api.get(endPoints.getAll, signal);
}

async function getOfferById(id, signal) {
    return await api.get(`${endPoints.getAll}/${id}`, signal);
}

async function createOffer(data) {
    return await api.post(endPoints.getAll, data);
}

async function editOfferById(id, data) {
    return await api.put(`${endPoints.getAll}/${id}`, data);
}

async function deleteOfferById(id) {
    return await api.del(`${endPoints.getAll}/${id}`);
}

export const offerServices = {
    getAllOffers,
    getOfferById,
    createOffer,
    editOfferById,
    deleteOfferById,
};

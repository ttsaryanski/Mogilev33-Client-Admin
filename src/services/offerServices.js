import { api } from "../utils/requester.js";

const endPoints = {
    getAll: "/offers",
    upload: "/offers/upload",
};

async function getAllOffers(signal) {
    return await api.get(endPoints.getAll, signal);
}

async function getOfferById(id, signal) {
    return await api.get(`${endPoints.getAll}/${id}`, signal);
}

async function createOffer(data) {
    return await api.post(endPoints.upload, data);
}

async function editOfferById(id, data) {
    return await api.put(`${endPoints.upload}/${id}`, data);
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

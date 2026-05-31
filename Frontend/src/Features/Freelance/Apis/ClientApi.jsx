import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:6969/api/client"
})

export async function addClient (data) {
    try {
        const response = await api.post("/create", data);
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response?.data;
    }
}

export async function fetchClient(ownerId) {
    try {
        const response = await api.get(`/show/${ownerId}`);
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response?.data;
    }
}

export async function updateClient(clientId, data) {
    try {
        const response = await api.put(`/update/${clientId}`, data);
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response?.data;
    }
}

export async function deleteClient(clientId) {
    try {
        const response = await api.delete(`/delete/${clientId}`);
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response?.data;
    }
}

import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:6969/api/project"
});

export async function addProject(data) {
    try {
        const response = await api.post("/create", data);
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response?.data;
    }
}

export async function fetchProjects(ownerId) {
    try {
        const response = await api.get(`/show/${ownerId}`);
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response?.data;
    }
}

export async function updateProject(projectId, data) {
    try {
        const response = await api.put(`/update/${projectId}`, data);
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response?.data;
    }
}

export async function deleteProject(projectId) {
    try {
        const response = await api.delete(`/delete/${projectId}`);
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response?.data;
    }
}

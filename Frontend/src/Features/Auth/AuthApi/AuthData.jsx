import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:6969/api/auth",
    withCredentials: true
})

export async function register({username, email, password}){
    try {
        const response = await api.post("/register",{username,email,password})
        return response
    } catch (error) {
        console.log(error)
        return error.response
    }
}

export async function login({email, password}){
    try {
        const response = await api.post("/login",{email,password})
        return response
    } catch (error) {
        console.log(error)
        return error.response
    }
}

export async function getme(){
    try {
        const response = await api.get("/getme");
        return response.data.userDetails;
    } catch (error) {
        console.log(error);
    }
}

export async function logout() {
    try {
        const response = await api.get('/logout');
        return response
    } catch (error) {
        console.log(error)
        return error.response
    }
}

export async function updateUser(data) {
    try {
        const response = await api.put('/update', data);
        return response
    } catch (error) {
        console.log(error)
        return error.response
    }
}

export async function resetPassword({ currentPassword, newPassword }) {
    try {
        const response = await api.put('/reset-password', { currentPassword, newPassword });
        return response
    } catch (error) {
        console.log(error)
        return error.response
    }
}

export async function requestEmailVerification() {
    try {
        const response = await api.post('/verify-email/request');
        return response
    } catch (error) {
        console.log(error)
        return error.response
    }
}

export async function verifyEmail(code) {
    try {
        const response = await api.post('/verify-email', { code });
        return response
    } catch (error) {
        console.log(error)
        return error.response
    }
}

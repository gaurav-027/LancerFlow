import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:6969/api/notification",
});

export async function createNotification(data) {
  try {
    const response = await api.post("/create", data);
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response?.data;
  }
}

export async function fetchNotifications(ownerId) {
  try {
    const response = await api.get(`/show/${ownerId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response?.data;
  }
}

export async function deleteNotification(notificationId) {
  try {
    const response = await api.delete(`/delete/${notificationId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response?.data;
  }
}

export async function clearNotifications(ownerId) {
  try {
    const response = await api.delete(`/clear/${ownerId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response?.data;
  }
}

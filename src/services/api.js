import axios from "axios";
 
const API = axios.create({
baseURL: "https://leave-backend-jziu.onrender.com/api"
});
 
export const createLeave = (data) => API.post("/leaves", data); 

export const getLeaves = () => API.get("/leaves");

export const deleteLeave = (id) => API.delete(`/leaves/${id}`);

export const updateLeave = (id, data) => API.put(`/leaves/${id}`, data);
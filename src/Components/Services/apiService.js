import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL 

const apiService = {
  get: (endpoint) => axios.get(`${API_URL}${endpoint}`),
  create: (endpoint, data) => axios.post(`${API_URL}${endpoint}`, data),
  update: (endpoint, id, data) =>
    axios.put(`${API_URL}${endpoint}/${id}`, data),
  remove: (endpoint, id) => axios.delete(`${API_URL}${endpoint}/${id}`),
};

export default apiService;

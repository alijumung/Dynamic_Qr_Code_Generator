import axios from 'axios';

// Create an Axios instance
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL, // Dynamically load the base URL from the environment variable
    withCredentials: true, // Allow sending cookies along with requests
});

export default apiClient;

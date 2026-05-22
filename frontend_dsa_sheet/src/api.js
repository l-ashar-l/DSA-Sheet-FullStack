import axios from "axios";

const baseURL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
const client = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("dsa_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginUser = async (credentials) => {
  const response = await client.post("/api/auth/login", credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await client.post("/api/auth/register", userData);
  return response.data;
};

export const getProfile = async () => {
  const response = await client.get("/api/auth/profile");
  return response.data;
};

export const getTopics = async () => {
  const response = await client.get("/api/topics");
  return response.data;
};

export const getTopicById = async (id) => {
  const response = await client.get(`/api/topics/${id}`);
  return response.data;
};

export const createTopic = async (topicData) => {
  const response = await client.post("/api/admin/topics", topicData);
  return response.data;
};

export const createProblem = async (problemData) => {
  const response = await client.post("/api/admin/problems", problemData);
  return response.data;
};

export const getProgress = async () => {
  const response = await client.get("/api/progress");
  return response.data;
};

export const toggleProgress = async (problemId, completed) => {
  const response = await client.post("/api/progress/toggle", {
    problemId,
    completed,
  });
  return response.data;
};

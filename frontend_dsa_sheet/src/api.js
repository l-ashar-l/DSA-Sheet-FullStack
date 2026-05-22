import axios from "axios";

const baseURL = process.env.REACT_APP_API_BASE_URL;
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
  const response = await client.post("/auth/login", credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await client.post("/auth/register", userData);
  return response.data;
};

export const getProfile = async () => {
  const response = await client.get("/auth/profile");
  return response.data;
};

export const getTopics = async () => {
  const response = await client.get("/topics");
  return response.data;
};

export const getTopicById = async (id) => {
  const response = await client.get(`/topics/${id}`);
  return response.data;
};

export const createTopic = async (topicData) => {
  const response = await client.post("/admin/topics", topicData);
  return response.data;
};

export const createProblem = async (problemData) => {
  const response = await client.post("/admin/problems", problemData);
  return response.data;
};

export const getProgress = async () => {
  const response = await client.get("/progress");
  return response.data;
};

export const toggleProgress = async (problemId, completed) => {
  const response = await client.post("/progress/toggle", {
    problemId,
    completed,
  });
  return response.data;
};

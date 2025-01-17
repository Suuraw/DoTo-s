import axios from "axios";

const SERVER_URL = import.meta.env.VITE_SERVER_API+"/api"||"http://localhost:3000/api";
console.log(SERVER_URL)
const registerUser = (data) => {
  return axios.post(SERVER_URL+"/register", data);
};

const loginUser = (data) => {
  return axios.post(SERVER_URL + "/login", data);
};

const AuthServices = {
  registerUser,
  loginUser,
};

export default AuthServices;

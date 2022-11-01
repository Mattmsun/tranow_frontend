import axios from "axios";
const serverUrl = process.env.REACT_APP_SERVER_URL;

export const signin = async (data) => {
  try {
    const response = await axios.post(`${serverUrl}/api/auth`, data);
    return response;
  } catch (error) {
    return error.response;
  }
};

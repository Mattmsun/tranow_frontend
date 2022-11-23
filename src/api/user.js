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

export const signup = async (data) => {
  try {
    const response = await axios.post(`${serverUrl}/api/users`, data);
    return response;
  } catch (error) {
    return error.response;
  }
};
export const getResetEmail = async (data) => {
  try {
    const response = await axios.put(
      `${serverUrl}/api/users/resetPasswordCode`,
      data
    );
    return response;
  } catch (error) {
    return error.response;
  }
};
export const resetPassword = async (data) => {
  const { resetCode, password } = data;
  try {
    const response = await axios.put(
      `${serverUrl}/api/users/resetPassword/${resetCode}`,
      { password }
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

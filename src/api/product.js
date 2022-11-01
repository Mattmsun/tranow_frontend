import axios from "axios";
const serverUrl = process.env.REACT_APP_SERVER_URL;

export const getProducts = async (data) => {
  try {
    const response = await axios.get(`${serverUrl}/api/products`);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${serverUrl}/api/products/${id}`);
    return response;
  } catch (error) {
    return error.response;
  }
};

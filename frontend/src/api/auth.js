
import axios from 'axios';

const API_URL = '/api/auth';

export const login = async (username, password, role) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      username,
      password,
      role,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const logout = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await axios.post(`${API_URL}/logout`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

import axios from 'axios';

const API_URL = '/api/teachers';

export const getTeacherClasses = async () => {
  const token = localStorage.getItem('accessToken');
  const response = await axios.get(`${API_URL}/classes/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getStudentsByClassId = async (classId) => {
  const token = localStorage.getItem('accessToken');
  const response = await axios.get(`${API_URL}/classes/${classId}/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.data;
};

export const sendReport = async (reportData) => {
  const token = localStorage.getItem('accessToken'); // Use accessToken from localStorage
  const response = await axios.post(`${API_URL}/reports/`, reportData, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getTodosByClassIdAndMonth = async (classId, year, month) => {
  const response = await axios.get(`${API_URL}/classes/${classId}/todos/`, {
    params: { year, month }
  });
  return response.data;
};

export const getFixtures = async () => {
  const token = localStorage.getItem('accessToken');
  const response = await axios.get(`${API_URL}/fixtures/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getTeacherProfile = async () => {
  const token = localStorage.getItem('accessToken');
  const response = await axios.get(`${API_URL}/me/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.data;
};

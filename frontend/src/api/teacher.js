
import axios from 'axios';

const API_URL = '/api/teachers';

export const getTeacherClasses = async () => {
  const response = await axios.get(`${API_URL}/classes/`);
  return response.data;
};

export const getStudentsByClassId = async (classId) => {
  const response = await axios.get(`${API_URL}/classes/${classId}/students/`);
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
  const response = await axios.get(`${API_URL}/classes/${classId}/todos/${year}/${month}/`);
  return response.data;
};

export const getFixtures = async () => {
  const response = await axios.get(`${API_URL}/fixtures/`);
  return response.data;
};

import axios from 'axios';

const USE_MOCK_DATA = false; // Set to true to use mock data for development/testing

const apiClient = axios.create({
    baseURL: '/api/admin',
    headers: {
        'Content-Type': 'application/json',
        // You might need to dynamically set the Authorization header
        // For example: 'Authorization': `Bearer ${getToken()}`
    }
});

// Request Interceptor
apiClient.interceptors.request.use(
    config => {
        console.log('🚀 Request:', config.method.toUpperCase(), config.url);
        if (config.data) {
            console.log('   Payload:', config.data);
        }
        return config;
    },
    error => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

// Response Interceptor
apiClient.interceptors.response.use(
    response => {
        console.log('✅ Response:', response.status, response.config.url);
        return response;
    },
    error => {
        console.error('❌ Response Error:', error.response ? error.response.status : '', error.config.url);
        if (error.response && error.response.data) {
            console.error('   Error Data:', error.response.data);
        }
        return Promise.reject(error);
    }
);

// Function to set the authorization token
export const setAuthToken = (token) => {
    if (token) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete apiClient.defaults.headers.common['Authorization'];
    }
};

// 비품 등록
export const addFixture = (name, price, count) => {
    return apiClient.post('/fixtures/', { name, price, count });
};

// 비품 수정
export const updateFixture = (itemId, name, price, count) => {
    return apiClient.patch(`/fixtures/${itemId}/`, { name, price, count });
};

// 비품 삭제
export const deleteFixture = (itemId) => {
    return apiClient.delete(`/fixtures/${itemId}/`);
};

// 비품 리스트 조회
export const getFixtures = (page = 1, size = 10) => {
    return apiClient.get('/fixtures/', { params: { page, size } });
};

// 클래스 리스트 조회
export const getClasses = () => {
    return apiClient.get('/classes/');
};

// 클래스 리스트를 강의실별로 그룹화하여 조회
export const getClassesGroupedByClassroom = () => {
    return apiClient.get('/classrooms/');
};

// 클래스 등록
export const addClass = async (classData) => {
    const { className, teacher, daysOfWeek, students, todos, classroom } = classData;

    const dataToSend = {
        className,
        teacher,
        daysOfWeek,
        students,
        todos,
        classroom
    };
    console.log('add시 클래스 데이터',classData);
    console.log("🚀 Add Class Request Payload:", dataToSend);
    try {
        const response = await apiClient.post('/classes/', dataToSend);
        console.log("✅ Add Class Response Data:", response.data);
        return response;
    } catch (error) {
        console.error("❌ Add Class Error:", error.response ? error.response.data : error.message);
        throw error;
    }
};

export const updateClass = async (classData) => {
    const { classId, className, teacher, daysOfWeek, students, todos, classroom } = classData;

    const dataToSend = {
        className,
        teacher,
        daysOfWeek,
        students,
        todos,
        classroom
    };
    console.log("🚀 Update Class Request Payload:", dataToSend);
    try {
        const response = await apiClient.patch(`/classes/${classId}/`, dataToSend);
        console.log("✅ Update Class Response Data:", response.data);
        return response;
    } catch (error) {
        console.error("❌ Update Class Error:", error.response ? error.response.data : error.message);
        throw error;
    }
};

// 클래스 삭제
export const deleteClass = (classId) => {
    return apiClient.delete(`/classes/${classId}/`);
};

// 학생 리스트 조회
export const getStudents = () => {
    return apiClient.get('/students/');
};

// 학생 등록
export const addStudent = (studentData) => {
    return apiClient.post('/students/', studentData);
};

// 학생 삭제
export const deleteStudent = (studentId) => {
    return apiClient.delete(`/students/${studentId}/`);
};

// 학생 수정
export const updateStudent = (studentData) => {
    return apiClient.patch(`/students/${studentData.id}/`, studentData);
};

// 교사 리스트 조회
export const getTeachers = () => {
    return apiClient.get('/teachers/');
};

// 교사 등록
export const addTeacher = (teacherData) => {
    return apiClient.post('/teachers/', teacherData);
};


// 교사 수정
export const updateTeacher = (teacherData) => {
    return apiClient.patch(`/teachers/${teacherData.id}/`, teacherData);
};

// 교사 삭제
export const deleteTeacher = (teacherId) => {
    return apiClient.delete(`/teachers/${teacherId}/`);
};

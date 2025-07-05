
import axios from 'axios';

const USE_MOCK_DATA = true; // Set to true to use mock data for development/testing

const apiClient = axios.create({
    baseURL: '/api/admin',
    headers: {
        'Content-Type': 'application/json',
        // You might need to dynamically set the Authorization header
        // For example: 'Authorization': `Bearer ${getToken()}`
    }
});

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
    if (USE_MOCK_DATA) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Mock: Adding fixture', { name, price, count });
                resolve({ data: { message: 'Fixture added successfully (mock)' } });
            }, 500);
        });
    }
    return apiClient.post('/fixtures', { name, price, count });
};

// 비품 수정
export const updateFixture = (itemId, name, price, count) => {
    if (USE_MOCK_DATA) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Mock: Updating fixture', { itemId, name, price, count });
                resolve({ data: { message: 'Fixture updated successfully (mock)' } });
            }, 500);
        });
    }
    return apiClient.patch(`/fixtures/${itemId}`, { name, price, count });
};

// 비품 삭제
export const deleteFixture = (itemId) => {
    if (USE_MOCK_DATA) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Mock: Deleting fixture', { itemId });
                resolve({ data: { message: 'Fixture deleted successfully (mock)' } });
            }, 500);
        });
    }
    return apiClient.delete(`/fixtures/${itemId}`);
};

// 비품 리스트 조회
export const getFixtures = (page = 1, size = 10) => {
    if (USE_MOCK_DATA) {
        const mockFixtures = [
            { itemId: 1, name: '빔 프로젝터', price: 1200000, count: 5 },
            { itemId: 2, name: '노트북', price: 1500000, count: 10 },
            { itemId: 3, name: '화이트보드', price: 50000, count: 20 },
            { itemId: 4, name: '마이크', price: 80000, count: 15 },
            { itemId: 5, name: '스피커', price: 200000, count: 8 },
            { itemId: 6, name: '카메라', price: 700000, count: 3 },
            { itemId: 7, name: '삼각대', price: 30000, count: 12 },
            { itemId: 8, name: '프린터', price: 400000, count: 4 },
            { itemId: 9, name: '스캐너', price: 250000, count: 2 },
            { itemId: 10, name: '모니터', price: 300000, count: 7 },
            { itemId: 11, name: '키보드', price: 20000, count: 25 },
            { itemId: 12, name: '마우스', price: 15000, count: 30 },
            { itemId: 13, name: 'USB 허브', price: 10000, count: 18 },
            { itemId: 14, name: '외장하드', price: 100000, count: 6 },
            { itemId: 15, name: '네트워크 케이블', price: 5000, count: 50 },
        ];

        const startIndex = (page - 1) * size;
        const endIndex = startIndex + size;
        const paginatedFixtures = mockFixtures.slice(startIndex, endIndex);
        const totalPage = Math.ceil(mockFixtures.length / size);

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    data: {
                        data: paginatedFixtures,
                        totalPage: totalPage,
                    },
                });
            }, 500); // Simulate network delay
        });
    }
    return apiClient.get('/fixtures', { params: { page, size } });
};

// 클래스 리스트 조회
export const getClasses = () => {
    if (USE_MOCK_DATA) {
        const mockClasses = [
            {
                classId: 101,
                className: "수학 A반",
                teacher: {
                    teacherId: 11,
                    teacherName: "박영수",
                    classTime: "월 수 금",
                    classroom: "101호"
                }
            },
            {
                classId: 102,
                className: "과학 B반",
                teacher: {
                    teacherId: 12,
                    teacherName: "이민지",
                    classTime: "월 금",
                    classroom: "103호"
                }
            },
            {
                classId: 103,
                className: "영어 C반",
                teacher: {
                    teacherId: 13,
                    teacherName: "김철수",
                    classTime: "화 목",
                    classroom: "102호"
                }
            },
            {
                classId: 104,
                className: "국어 D반",
                teacher: {
                    teacherId: 14,
                    teacherName: "최영희",
                    classTime: "수 금",
                    classroom: "104호"
                }
            },
        ];

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    data: {
                        classes: mockClasses,
                    },
                });
            }, 500); // Simulate network delay
        });
    }
    return apiClient.get('/classes');
};

// 클래스 등록
export const addClass = (className, teacherName, daysOfWeek, students, todos) => {
    if (USE_MOCK_DATA) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Mock: Adding class', { className, teacherName, daysOfWeek, students, todos });
                resolve({ data: { message: 'Class added successfully (mock)' } });
            }, 500);
        });
    }
    return apiClient.post('/classes', { className, teacherName, daysOfWeek, students, todos });
};

// 클래스 수정
export const updateClass = (classId, className, teacherName, daysOfWeek, students, todos) => {
    if (USE_MOCK_DATA) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Mock: Updating class', { classId, className, teacherName, daysOfWeek, students, todos });
                resolve({ data: { message: 'Class updated successfully (mock)' } });
            }, 500);
        });
    }
    return apiClient.patch(`/classes/${classId}`, { className, teacherName, daysOfWeek, students, todos });
};

// 클래스 삭제
export const deleteClass = (classId) => {
    if (USE_MOCK_DATA) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Mock: Deleting class', { classId });
                resolve({ data: { message: 'Class deleted successfully (mock)' } });
            }, 500);
        });
    }
    return apiClient.delete(`/classes/${classId}`);
};

// 학생 리스트 조회
export const getStudents = () => {
    if (USE_MOCK_DATA) {
        const mockStudents = [
            { studentId: 301, studentName: "박철수" },
            { studentId: 302, studentName: "김영희" },
            { studentId: 303, studentName: "이찬원" },
            { studentId: 304, studentName: "장민호" },
            { studentId: 305, studentName: "최수정" },
            { studentId: 306, studentName: "정동원" },
            { studentId: 307, studentName: "임영웅" },
            { studentId: 308, studentName: "영탁" },
        ];

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    data: {
                        students: mockStudents,
                    },
                });
            }, 500); // Simulate network delay
        });
    }
    return apiClient.get('/students');
};

// 교사 리스트 조회
export const getTeachers = () => {
    if (USE_MOCK_DATA) {
        const mockTeachers = [
            { teacherId: 11, teacherName: "박영수" },
            { teacherId: 12, teacherName: "이민지" },
            { teacherId: 13, teacherName: "김철수" },
            { teacherId: 14, teacherName: "최영희" },
            { teacherId: 15, teacherName: "강동원" },
            { teacherId: 16, teacherName: "송혜교" },
        ];

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    data: {
                        teachers: mockTeachers,
                    },
                });
            }, 500); // Simulate network delay
        });
    }
    return apiClient.get('/teachers');
};

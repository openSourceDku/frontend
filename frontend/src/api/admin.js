
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

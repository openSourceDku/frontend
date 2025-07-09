import React, { useState, useEffect, useCallback } from 'react';
import { getFixtures, addFixture, updateFixture, deleteFixture } from '../../api/admin';

const AdminEquipment = () => {
    const [fixtures, setFixtures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [size] = useState(10);
    const [totalPage, setTotalPage] = useState(1);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentFixture, setCurrentFixture] = useState(null);
    const [newFixtureName, setNewFixtureName] = useState('');
    const [newFixturePrice, setNewFixturePrice] = useState('');
    const [newFixtureCount, setNewFixtureCount] = useState('');

    const fetchFixtures = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getFixtures(page, size);
            setFixtures(response.data.data || []);
            setTotalPage(response.data.totalPage);
        } catch (err) {
            setError('비품 목록을 불러오는데 실패했습니다.');
            console.error('Failed to fetch fixtures:', err);
        } finally {
            setLoading(false);
        }
    }, [page, size]);

    useEffect(() => {
        fetchFixtures();
    }, [page, size, fetchFixtures]);

    const handleAddFixture = async () => {
        try {
            await addFixture(newFixtureName, parseInt(newFixturePrice), parseInt(newFixtureCount));
            setShowAddModal(false);
            setNewFixtureName('');
            setNewFixturePrice('');
            setNewFixtureCount('');
            fetchFixtures();
        } catch (err) {
            setError('비품 등록에 실패했습니다.');
            console.error('Failed to add fixture:', err);
        }
    };

    const handleEditFixture = async () => {
        if (!currentFixture) return;
        console.log('Updating fixture with ID:', currentFixture.id); // Debugging line
        try {
            await updateFixture(currentFixture.id, newFixtureName, parseInt(newFixturePrice), parseInt(newFixtureCount));
            setShowEditModal(false);
            setNewFixtureName('');
            setNewFixturePrice('');
            setNewFixtureCount('');
            setCurrentFixture(null);
            fetchFixtures();
        } catch (err) {
            alert('비품 수정에 실패했습니다.'); // Changed to alert
            console.error('Failed to edit fixture:', err);
        }
    };

    const handleDeleteFixture = async (itemId) => {
        if (window.confirm('정말로 이 비품을 삭제하시겠습니까?')) {
            try {
                await deleteFixture(itemId);
                fetchFixtures();
            } catch (err) {
                setError('비품 삭제에 실패했습니다.');
                console.error('Failed to delete fixture:', err);
            }
        }
    };

    const openEditModal = (fixture) => {
        setCurrentFixture(fixture);
        setNewFixtureName(fixture.name);
        setNewFixturePrice(fixture.price);
        setNewFixtureCount(fixture.count);
        setShowEditModal(true);
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>비품 관리</h1>
            <button onClick={() => setShowAddModal(true)} style={{ marginBottom: '20px', padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>비품 등록</button>

            {loading && <p>로딩 중...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {!loading && !error && (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f2f2f2' }}>
                            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>ID</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>이름</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>가격</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>수량</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>액션</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fixtures.map((fixture) => (
                            <tr key={fixture.itemId}>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{fixture.id}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{fixture.name}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{fixture.price}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{fixture.count}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                    <button onClick={() => openEditModal(fixture)} style={{ marginRight: '10px', padding: '5px 10px', backgroundColor: '#008CBA', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>수정</button>
                                    <button onClick={() => handleDeleteFixture(fixture.id)} style={{ padding: '5px 10px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>삭제</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                {Array.from({ length: totalPage }, (_, i) => i + 1).map((pageNumber) => (
                    <button
                        key={pageNumber}
                        onClick={() => setPage(pageNumber)}
                        style={{
                            margin: '0 5px',
                            padding: '8px 12px',
                            backgroundColor: page === pageNumber ? '#007bff' : '#f0f0f0',
                            color: page === pageNumber ? 'white' : 'black',
                            border: '1px solid #ddd',
                            borderRadius: '3px',
                            cursor: 'pointer',
                        }}
                    >
                        {pageNumber}
                    </button>
                ))}
            </div>

            {/* Add Fixture Modal */}
            {showAddModal && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <h2>비품 등록</h2>
                        <label style={labelStyle}>이름:</label>
                        <input type="text" value={newFixtureName} onChange={(e) => setNewFixtureName(e.target.value)} style={inputStyle} />
                        <label style={labelStyle}>가격:</label>
                        <input type="number" value={newFixturePrice} onChange={(e) => setNewFixturePrice(e.target.value)} style={inputStyle} />
                        <label style={labelStyle}>수량:</label>
                        <input type="number" value={newFixtureCount} onChange={(e) => setNewFixtureCount(e.target.value)} style={inputStyle} />
                        <div style={buttonContainerStyle}>
                            <button onClick={handleAddFixture} style={saveButtonStyle}>등록</button>
                            <button onClick={() => setShowAddModal(false)} style={cancelButtonStyle}>취소</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Fixture Modal */}
            {showEditModal && currentFixture && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <h2>비품 수정</h2>
                        <label style={labelStyle}>이름:</label>
                        <input type="text" value={newFixtureName} onChange={(e) => setNewFixtureName(e.target.value)} style={inputStyle} />
                        <label style={labelStyle}>가격:</label>
                        <input type="number" value={newFixturePrice} onChange={(e) => setNewFixturePrice(e.target.value)} style={inputStyle} />
                        <label style={labelStyle}>수량:</label>
                        <input type="number" value={newFixtureCount} onChange={(e) => setNewFixtureCount(e.target.value)} style={inputStyle} />
                        <div style={buttonContainerStyle}>
                            <button onClick={handleEditFixture} style={saveButtonStyle}>수정</button>
                            <button onClick={() => setShowEditModal(false)} style={cancelButtonStyle}>취소</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
};

const modalContentStyle = {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    width: '400px', // Increased width
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)', // Added shadow
    display: 'flex',
    flexDirection: 'column',
    gap: '15px', // Spacing between elements
};

const inputStyle = {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box',
};

const labelStyle = {
    marginBottom: '5px',
    fontWeight: 'bold',
};

const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '20px',
    gap: '10px',
};

const saveButtonStyle = {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
};

const cancelButtonStyle = {
    padding: '10px 20px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
};

export default AdminEquipment;

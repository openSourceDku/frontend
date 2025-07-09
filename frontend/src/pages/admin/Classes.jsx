import React, { useState, useEffect } from 'react';
import { addClass, updateClass, deleteClass, getTeachers, getClassesGroupedByClassroom } from '../../api/admin';
import ClassFormModal from '../../components/admin/ClassFormModal';

const AdminClasses = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentClass, setCurrentClass] = useState(null);
    const [allTeachers, setAllTeachers] = useState([]); // allTeachers 상태 추가

    useEffect(() => {
        fetchClasses();
        fetchTeachers(); // 교사 목록 불러오기
    }, []);

    const fetchTeachers = async () => {
        try {
            const response = await getTeachers();
            setAllTeachers(response.data.teachers || []);
        } catch (err) {
            console.error('Failed to fetch teachers:', err);
        }
    };

    const fetchClasses = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getClassesGroupedByClassroom();
            console.log("API Response for getClassesGroupedByClassroom:", response.data);
            // Assuming response.data is already the array of classes
            if (Array.isArray(response.data)) {
                setClasses(response.data);
            } else {
                console.warn("Unexpected API response structure: Expected an array of classes.", response.data);
                setClasses([]);
            }
        } catch (err) {
            setError('클래스 목록을 불러오는데 실패했습니다.');
            console.error('Failed to fetch classes:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddClick = () => {
        setCurrentClass(null);
        setShowModal(true);
    };

    const handleEditClick = (cls) => {
        setCurrentClass(cls);
        setShowModal(true);
    };

    const handleSaveClass = async (classData) => {
        console.log(classData)

        try {
            if (currentClass) {
                console.log("Data sent to updateClass (from Classes.jsx):");
                console.log({
                    ...classData,
                    classId: currentClass.id,
                });
                await updateClass({
                    ...classData,
                    classId: currentClass.classId,
                });
            } else {
                // For add, use the POST API structure
                await addClass(classData);
            }
            setShowModal(false);
            fetchClasses();
        } catch (err) {
            alert('클래스 저장에 실패했습니다.');
            console.error('Failed to save class:', err);
        }
    };

    const handleDeleteClass = async (classId) => {
        if (window.confirm('정말로 이 클래스를 삭제하시겠습니까?')) {
            try {
                await deleteClass(classId);
                setShowModal(false);
                fetchClasses();
            } catch (err) {
                setError('클래스 삭제에 실패했습니다.');
                console.error('Failed to delete class:', err);
            }
        }
    };
    console.log(classes)
    return (
        <div style={{ padding: '20px' }}>
            <h1>반 관리</h1>
            <button onClick={handleAddClick} style={{ marginBottom: '20px', padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>반 등록</button>

            {loading && <p>로딩 중...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {!loading && !error && classes.length > 0 && (
                <div style={{ width: '100%' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f2f2f2' }}>
                                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>ID</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>이름</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>담당 교사</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>수업 시간</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>강의실</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>액션</th>
                            </tr>
                        </thead>
                        <tbody>
                            {classes.map((cls) => (
                                <tr key={cls.classId}>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{cls.classId}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{cls.className}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{cls.teacher ? cls.teacher.name : '-'}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{cls.daysOfWeek ? cls.daysOfWeek.map(day => {
                                        const dayMap = {
                                            'MONDAY': '월요일',
                                            'TUESDAY': '화요일',
                                            'WEDNESDAY': '수요일',
                                            'THURSDAY': '목요일',
                                            'FRIDAY': '금요일',
                                            'SATURDAY': '토요일',
                                            'SUNDAY': '일요일'
                                        };
                                        return dayMap[day.trim()] || day.trim();
                                    }).join(', ') : '-'}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{cls.classroom}</td>
                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                        <button onClick={() => handleEditClick(cls)} style={{ marginRight: '10px', padding: '5px 10px', backgroundColor: '#008CBA', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>수정</button>
                                        <button onClick={() => handleDeleteClass(cls.classId)} style={{ padding: '5px 10px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>삭제</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {!loading && !error && classes.length === 0 && (
                <p>등록된 반이 없습니다.</p>
            )}

            <ClassFormModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onSave={handleSaveClass}
                onDelete={handleDeleteClass}
                classData={currentClass}
                allTeachers={allTeachers} // allTeachers prop 전달
            />
        </div>
    );
};

export default AdminClasses;

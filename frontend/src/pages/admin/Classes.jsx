import React, { useState, useEffect } from 'react';
import { getClasses, addClass, updateClass, deleteClass } from '../../api/admin';
import ClassFormModal from '../../components/admin/ClassFormModal';

const AdminClasses = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentClass, setCurrentClass] = useState(null);

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getClasses();
            setClasses(response.data.classes || []);
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
        try {
            if (currentClass) {
                await updateClass(currentClass.classId, classData.className, classData.teacherId, classData.daysOfWeek, classData.students, classData.todos);
            } else {
                await addClass(classData.className, classData.teacherId, classData.daysOfWeek, classData.students, classData.todos);
            }
            setShowModal(false);
            fetchClasses();
        } catch (err) {
            setError('클래스 저장에 실패했습니다.');
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

    return (
        <div style={{ padding: '20px' }}>
            <h1>반 관리</h1>
            <button onClick={handleAddClick} style={{ marginBottom: '20px', padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>반 등록</button>

            {loading && <p>로딩 중...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {!loading && !error && (
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
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{cls.teacher.teacherName}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{cls.teacher.classTime}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{cls.teacher.classroom}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                    <button onClick={() => handleEditClick(cls)} style={{ marginRight: '10px', padding: '5px 10px', backgroundColor: '#008CBA', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>수정</button>
                                    <button onClick={() => handleDeleteClass(cls.classId)} style={{ padding: '5px 10px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>삭제</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <ClassFormModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onSave={handleSaveClass}
                onDelete={handleDeleteClass}
                classData={currentClass}
            />
        </div>
    );
};

export default AdminClasses;

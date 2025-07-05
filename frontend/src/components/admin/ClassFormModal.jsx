import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getStudents, getTeachers } from '../../api/admin';

const ClassFormModal = ({ show, onClose, onSave, onDelete, classData }) => {
    const [className, setClassName] = useState('');
    const [teacherName, setTeacherName] = useState('');
    const [daysOfWeek, setDaysOfWeek] = useState([]);
    const [allStudents, setAllStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [todos, setTodos] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date()); // Initialize with current date
    const [allTeachers, setAllTeachers] = useState([]);
    const [selectedTeacherId, setSelectedTeacherId] = useState('');

    const todosForSelectedDate = React.useMemo(() => {
        return todos.filter(todo =>
            selectedDate && todo.date === selectedDate.toISOString().split('T')[0]
        );
    }, [todos, selectedDate]);

    useEffect(() => {
        const fetchAllStudentsAndTeachers = async () => {
            try {
                const [studentsResponse, teachersResponse] = await Promise.all([
                    getStudents(),
                    getTeachers()
                ]);
                setAllStudents(studentsResponse.data.students || []);
                setAllTeachers(teachersResponse.data.teachers || []);
            } catch (err) {
                console.error('Failed to fetch students or teachers:', err);
            }
        };
        fetchAllStudentsAndTeachers();
    }, []);

    useEffect(() => {
        if (classData) {
            setClassName(classData.className);
            setSelectedTeacherId(classData.teacher.teacherId); // Set selected teacher ID
            const daysMap = {
                '월': 'MONDAY', '화': 'TUESDAY', '수': 'WEDNESDAY', '목': 'THURSDAY', '금': 'FRIDAY', '토': 'SATURDAY', '일': 'SUNDAY'
            };
            const parsedDays = classData.teacher.classTime ? classData.teacher.classTime.split(' ').map(day => daysMap[day]).filter(Boolean) : [];
            setDaysOfWeek(parsedDays);
            setSelectedStudents(classData.students ? classData.students.map(s => s.studentId) : []);
            setTodos(classData.todos ? classData.todos.map(todo => ({ ...todo, date: todo.date ? new Date(todo.date) : '' })) : []);
        } else {
            setClassName('');
            setSelectedTeacherId(''); // Reset selected teacher ID
            setDaysOfWeek([]);
            setSelectedStudents([]);
            setTodos([]);
        }
        setSelectedDate(new Date()); // Reset selected date when modal opens/closes
    }, [classData]);

    const handleStudentChange = (studentId) => {
        setSelectedStudents(prev =>
            prev.includes(studentId)
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    const handleAddTodoForSelectedDate = () => {
        if (selectedDate) {
            setTodos(prev => [...prev, { alias: '', date: selectedDate.toISOString().split('T')[0], items: [] }]);
        } else {
            alert('날짜를 선택해주세요.');
        }
    };

    const handleTodoChange = (todoToUpdate, field, value) => {
        setTodos(prevTodos => {
            return prevTodos.map(todo => {
                if (todo === todoToUpdate) {
                    if (field === 'items') {
                        return { ...todo, [field]: value.split(',').map(item => item.trim()).filter(item => item !== '') };
                    } else {
                        return { ...todo, [field]: value };
                    }
                }
                return todo;
            });
        });
    };

    const handleRemoveTodo = (todoToRemove) => {
        setTodos(prevTodos => prevTodos.filter(todo => todo !== todoToRemove));
    };

    const handleSubmit = () => {
        const studentsToSave = allStudents.filter(student => selectedStudents.includes(student.studentId));
        onSave({ className, teacherId: selectedTeacherId, daysOfWeek, students: studentsToSave, todos });
    };

    if (!show) {
        return null;
    }

    return (
        <div style={modalOverlayStyle}>
            <div style={modalContentStyle}>
                <div style={{ flex: 1, paddingRight: '20px', borderRight: '1px solid #eee' }}>
                    <h2>{classData ? '반 수정' : '반 등록'}</h2>
                    <label>반 이름:</label>
                    <input
                        type="text"
                        value={className}
                        onChange={(e) => setClassName(e.target.value)}
                        style={inputStyle}
                    />
                    <label>담당 교사:</label>
                    <select
                        value={selectedTeacherId}
                        onChange={(e) => setSelectedTeacherId(parseInt(e.target.value))}
                        style={inputStyle}
                    >
                        <option value="">교사 선택</option>
                        {allTeachers.map(teacher => (
                            <option key={teacher.teacherId} value={teacher.teacherId}>
                                {teacher.teacherName}
                            </option>
                        ))}
                    </select>
                    <label>수업 요일:</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
                        {[ '월', '화', '수', '목', '금', '토', '일' ].map((day) => (
                            <label key={day}>
                                <input
                                    type="checkbox"
                                    value={day}
                                    checked={daysOfWeek.includes({
                                        '월': 'MONDAY', '화': 'TUESDAY', '수': 'WEDNESDAY', '목': 'THURSDAY', '금': 'FRIDAY', '토': 'SATURDAY', '일': 'SUNDAY'
                                    }[day])}
                                    onChange={(e) => {
                                        const englishDay = {
                                            '월': 'MONDAY', '화': 'TUESDAY', '수': 'WEDNESDAY', '목': 'THURSDAY', '금': 'FRIDAY', '토': 'SATURDAY', '일': 'SUNDAY'
                                        }[day];
                                        if (e.target.checked) {
                                            setDaysOfWeek([...daysOfWeek, englishDay]);
                                        } else {
                                            setDaysOfWeek(daysOfWeek.filter(d => d !== englishDay));
                                        }
                                    }}
                                />
                                {day}
                            </label>
                        ))}
                    </div>
                    <label>학생 등록:</label>
                    <div style={{ border: '1px solid #ddd', padding: '10px', maxHeight: '150px', overflowY: 'auto' }}>
                        {allStudents.map(student => (
                            <div key={student.studentId} style={{ marginBottom: '5px' }}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={selectedStudents.includes(student.studentId)}
                                        onChange={() => handleStudentChange(student.studentId)}
                                    />
                                    {student.studentName} ({student.studentId})
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ flex: 1, paddingLeft: '20px' }}>
                    <h2>할 일 관리</h2>
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        dateFormat="yyyy-MM-dd"
                        inline
                    />
                    {selectedDate && (
                        <div style={{ marginTop: '20px' }}>
                            <h3>{selectedDate.toLocaleDateString()} 할 일</h3>
                            <button onClick={handleAddTodoForSelectedDate} style={{ padding: '5px 10px', backgroundColor: '#008CBA', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', marginBottom: '10px' }}>할 일 추가</button>
                            {todosForSelectedDate.length > 0 ? (
                                todosForSelectedDate.map((todo, index) => (
                                    <div key={todo.alias + todo.date} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #eee', borderRadius: '5px' }}>
                                        <label>별칭:</label>
                                        <input
                                            type="text"
                                            value={todo.alias}
                                            onChange={(e) => handleTodoChange(todo, 'alias', e.target.value)}
                                            style={inputStyle}
                                        />
                                        <label>세부 목록 (쉼표로 구분):</label>
                                        <input
                                            type="text"
                                            value={todo.items.join(', ')}
                                            onChange={(e) => handleTodoChange(todo, 'items', e.target.value)}
                                            style={inputStyle}
                                        />
                                        <button onClick={() => handleRemoveTodo(todo)} style={{ padding: '5px 10px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', marginTop: '5px' }}>삭제</button>
                                    </div>
                                ))
                            ) : (
                                <p>선택된 날짜에 할 일이 없습니다.</p>
                            )}
                        </div>
                    )}
                    </div>
                <div style={buttonContainerStyle}>
                    <button onClick={handleSubmit} style={saveButtonStyle}>저장</button>
                    {classData && (
                        <button onClick={() => onDelete(classData.classId)} style={deleteButtonStyle}>삭제</button>
                    )}
                    <button onClick={onClose} style={cancelButtonStyle}>취소</button>
                </div>
            </div>
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
};

const modalContentStyle = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    width: '900px', // Increased width for two columns
    maxHeight: '90vh',
    overflowY: 'auto',
    display: 'flex',
    gap: '20px',
};

const inputStyle = {
    width: '100%',
    padding: '8px',
    margin: '5px 0',
    boxSizing: 'border-box',
};

const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '20px',
    gap: '10px',
};

const saveButtonStyle = {
    padding: '8px 15px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
};

const deleteButtonStyle = {
    padding: '8px 15px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
};

const cancelButtonStyle = {
    padding: '8px 15px',
    backgroundColor: '#cccccc',
    color: 'black',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
};

export default ClassFormModal;

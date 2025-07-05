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
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [allTeachers, setAllTeachers] = useState([]);
    const [selectedTeacherId, setSelectedTeacherId] = useState('');
    const [currentTodoInput, setCurrentTodoInput] = useState({ alias: '', items: '' });
    const [currentEditingTodo, setCurrentEditingTodo] = useState(null); // New state to hold the todo being edited
    const [studentSearchTerm, setStudentSearchTerm] = useState(''); // New state for student search term
    const [classroom, setClassroom] = useState(''); // New state for classroom

    const todosForSelectedDate = React.useMemo(() => {
        return todos.filter(todo =>
            selectedDate && todo.date === selectedDate.toISOString().split('T')[0]
        );
    }, [todos, selectedDate]);

    const highlightedDates = React.useMemo(() => {
        return todos.map(todo => new Date(todo.date));
    }, [todos]);

    const filteredStudents = React.useMemo(() => {
        return allStudents.filter(student =>
            student.studentName.toLowerCase().includes(studentSearchTerm.toLowerCase())
        );
    }, [allStudents, studentSearchTerm]);

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
            setTodos(classData.todos ? classData.todos.map(todo => ({ ...todo, id: todo.id || Date.now() + Math.random(), date: todo.date ? new Date(todo.date) : '' })) : []);
            setClassroom(classData.teacher.classroom || ''); // Initialize classroom
        } else {
            setClassName('');
            setSelectedTeacherId(''); // Reset selected teacher ID
            setDaysOfWeek([]);
            setSelectedStudents([]);
            setTodos([]);
            setClassroom(''); // Reset classroom
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
        if (!selectedDate) {
            alert('날짜를 선택해주세요.');
            return;
        }
        if (todosForSelectedDate.length > 0 && !currentEditingTodo) {
            alert('선택된 날짜에는 하나의 할 일만 등록할 수 있습니다.');
            return;
        }
        // This function is now primarily for adding a new todo input form, not directly adding to todos state
        // The actual adding to todos state happens via handleCompleteTodo
        setCurrentTodoInput({ alias: '', items: '' });
        setCurrentEditingTodo(null); // Ensure we are adding a new one
    };

    const handleCompleteTodo = () => {
        if (!selectedDate) {
            alert('날짜를 선택해주세요.');
            return;
        }
        if (!currentTodoInput.alias || !currentTodoInput.items) {
            alert('별칭과 세부 목록을 입력해주세요.');
            return;
        }

        const newTodo = {
            id: currentEditingTodo ? currentEditingTodo.id : Date.now() + Math.random(),
            alias: currentTodoInput.alias,
            date: selectedDate.toISOString().split('T')[0],
            items: currentTodoInput.items.split(',').map(item => item.trim()).filter(item => item !== ''),
        };

        setTodos(prevTodos => {
            if (currentEditingTodo) {
                // Update existing todo
                return prevTodos.map(todo =>
                    todo.id === currentEditingTodo.id ? newTodo : todo
                );
            } else {
                // Add new todo
                return [...prevTodos, newTodo];
            }
        });

        setCurrentTodoInput({ alias: '', items: '' }); // Clear input fields
        setCurrentEditingTodo(null); // Clear editing state
    };

    const handleEditTodo = (todoToEdit) => {
        setSelectedDate(new Date(todoToEdit.date)); // Set calendar to todo's date
        setCurrentTodoInput({ alias: todoToEdit.alias, items: todoToEdit.items.join(', ') });
        setCurrentEditingTodo(todoToEdit);
    };

    const handleTodoInputChange = (field, value) => {
        setCurrentTodoInput(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        const studentsToSave = allStudents.filter(student => selectedStudents.includes(student.studentId));
        onSave({ className, teacherId: selectedTeacherId, daysOfWeek, students: studentsToSave, todos, classroom });
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
                        {['월', '화', '수', '목', '금', '토', '일'].map((day) => (
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
                    <label>강의실:</label>
                    <input
                        type="text"
                        value={classroom}
                        onChange={(e) => setClassroom(e.target.value)}
                        style={inputStyle}
                    />
                    <label>학생 등록:</label>
                    <input
                        type="text"
                        placeholder="학생 이름 검색..."
                        value={studentSearchTerm}
                        onChange={(e) => setStudentSearchTerm(e.target.value)}
                        style={{ ...inputStyle, marginBottom: '10px' }}
                    />
                    <div style={{ border: '1px solid #ddd', padding: '10px', maxHeight: '150px', overflowY: 'auto' }}>
                        {filteredStudents.map(student => (
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
                        highlightDates={highlightedDates}
                    />
                    {selectedDate && (
                        <div style={{ marginTop: '20px' }}>
                            <h3>{selectedDate.toLocaleDateString()} 할 일</h3>
                            {todosForSelectedDate.length > 0 ? (
                                todosForSelectedDate.map((todo) => (
                                    <div key={todo.id} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #eee', borderRadius: '5px' }}>
                                        <p><strong>별칭:</strong> {todo.alias}</p>
                                        <p><strong>세부 목록:</strong> {todo.items.join(', ')}</p>
                                        <button onClick={() => handleEditTodo(todo)} style={{ marginRight: '10px', padding: '5px 10px', backgroundColor: '#008CBA', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>수정</button>
                                        <button onClick={() => handleRemoveTodo(todo)} style={{ padding: '5px 10px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>삭제</button>
                                    </div>
                                ))
                            ) : (
                                <div style={{ marginBottom: '15px', padding: '10px', border: '1px solid #eee', borderRadius: '5px' }}>
                                    <label>별칭:</label>
                                    <input
                                        type="text"
                                        value={currentTodoInput.alias}
                                        onChange={(e) => handleTodoInputChange('alias', e.target.value)}
                                        style={inputStyle}
                                    />
                                    <label>세부 목록 (쉼표로 구분):</label>
                                    <input
                                        type="text"
                                        value={currentTodoInput.items}
                                        onChange={(e) => handleTodoInputChange('items', e.target.value)}
                                        style={inputStyle}
                                    />
                                    <button onClick={handleCompleteTodo} style={{ padding: '5px 10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', marginTop: '5px' }}>완료</button>
                                </div>
                            )}
                        </div>
                    )}
                    <div style={buttonContainerStyle}>
                        <button onClick={handleSubmit} style={saveButtonStyle}>저장</button>
                        {classData && (
                            <button onClick={() => onDelete(classData.classId)} style={deleteButtonStyle}>삭제</button>
                        )}
                        <button onClick={onClose} style={cancelButtonStyle}>취소</button>
                    </div>
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

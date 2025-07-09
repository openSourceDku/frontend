import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getStudents } from '../../api/admin';

const ClassFormModal = ({ show, onClose, onSave, onDelete, classData, allTeachers }) => {
    const [className, setClassName] = useState('');
    const [daysOfWeek, setDaysOfWeek] = useState([]);
    const [allStudents, setAllStudents] = useState([]);
    const [selectedStudentIds, setSelectedStudentIds] = useState([]); // 학생 ID만 저장
    const [todos, setTodos] = useState([]);
    const [currentTodo, setCurrentTodo] = useState(null); // 현재 편집 중인 할 일
    const [selectedDate, setSelectedDate] = useState(new Date()); // Initialize with current date
    const [selectedTeacherId, setSelectedTeacherId] = useState('');
    const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태 추가
    const [classroom, setClassroom] = useState(''); // classroom 상태 추가

    const todosForSelectedDate = React.useMemo(() => {
        return todos.filter(todo =>
            selectedDate && todo.date === selectedDate.toISOString().split('T')[0]
        );
    }, [todos, selectedDate]);
    // 검색어에 따라 필터링된 학생 목록
    const filteredStudents = React.useMemo(() => {
        return allStudents.filter(student =>
            student.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [allStudents, searchTerm]);

    useEffect(() => {
        const fetchAllStudents = async () => {
            try {
                const studentsResponse = await getStudents();
                setAllStudents(studentsResponse.data.students || []);
            } catch (err) {
                console.error('Failed to fetch students:', err);
            }
        };
        fetchAllStudents();
    }, []);

    const formatDate = (date) => {
        if (!date) return '';
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        console.log("ClassFormModal received classData:", classData);
        if (classData) {
            console.log('조회시 전달받는',classData)
            setClassName(classData.className || ''); // className이 없을 경우 빈 문자열
            setSelectedTeacherId(classData.teacher ? classData.teacher.teacherId : ''); // teacherId 사용
            // classData.daysOfWeek가 배열이므로 직접 사용
            setDaysOfWeek(classData.daysOfWeek || []);
            setSelectedStudentIds(classData.students ? classData.students.map(s => s.studentId) : []); // studentId 사용
            setTodos(classData.todos ? classData.todos.map(todo => {
                const newTodo = {
                    ...todo,
                    date: formatDate(todo.date),
                    title: todo.todoTitle || '',
                    task: todo.description || '',
                };
                if (newTodo.id === undefined) {
                    delete newTodo.id;
                }
                return newTodo;
            }) : []);
            setClassroom(classData.classroom || '');
        } else {
            setClassName('');
            setSelectedTeacherId(''); // Reset selected teacher ID
            setDaysOfWeek([]);
            setSelectedStudentIds([]); // studentId로 변경
            setTodos([]);
            setClassroom(''); // classroom 초기화
        }
        setSelectedDate(new Date()); // Reset selected date when modal opens/closes
    }, [classData]);

    const handleStudentChange = (student_id) => { // student_id로 변경
        setSelectedStudentIds(prev => // selectedStudentIds로 변경
            prev.includes(student_id)
                ? prev.filter(id => id !== student_id)
                : [...prev, student_id]
        );
    };

    const handleAddTodoForSelectedDate = () => {
        if (selectedDate) {
            setTodos(prev => [...prev, { date: selectedDate.toISOString().split('T')[0], title: '', task: '' }]); // title, task 추가
        } else {
            alert('날짜를 선택해주세요.');
        }
    };

    const handleTodoChange = (todoToUpdate, field, value) => {
        setTodos(prevTodos => {
            return prevTodos.map(todo => {
                if (todo === todoToUpdate) {
                    return { ...todo, [field]: value }; // items 대신 title, task 처리
                }
                return todo;
            });
        });
    };

    const handleRemoveTodo = (todoToRemove) => {
        setTodos(prevTodos => prevTodos.filter(todo => todo !== todoToRemove));
    };

    const handleSubmit = () => {
        const selectedTeacher = allTeachers.find(t => t.teacherId === selectedTeacherId);

        const studentIdsToSave = selectedStudentIds; // 학생 ID 배열 그대로 전달

        // todos는 Class 모델과 직접적인 관계가 없으므로, 여기서는 처리하지 않습니다.
        // 백엔드에서 별도의 API로 처리하거나, 필요하다면 다른 방식으로 전달해야 합니다.

        const todosToSave = todos.map(todo => ({
            date: todo.date,
            title: todo.title,
            task: todo.task,
        }));

        onSave({
            className,
            teacher: selectedTeacher ? { teacherId: selectedTeacher.teacherId, name: selectedTeacher.name } : null, // 교사 ID와 이름을 객체 형태로 전달
            daysOfWeek,
            students: selectedStudentIds.map(id => {
                const student = allStudents.find(s => s.studentId === id);
                return student ? { studentId: student.studentId, name: student.name } : null;
            }).filter(Boolean), // 학생 ID와 이름을 객체 배열 형태로 전달
            todos: todosToSave,
            classroom
        });
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
                            <option key={teacher.teacherId} value={teacher.teacherId}> {/* teacher.teacherId로 변경 */}
                                {teacher.name} {/* teacher.name으로 변경 */}
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
                    <label>학생 등록:</label>
                    <input
                        type="text"
                        placeholder="학생 이름으로 검색"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={inputStyle}
                    />
                    <div style={{ border: '1px solid #ddd', padding: '10px', maxHeight: '150px', overflowY: 'auto' }}>
                        {filteredStudents.map(student => (
                            <div key={student.studentId} style={{ marginBottom: '5px' }}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={selectedStudentIds.includes(student.studentId)}
                                        onChange={() => handleStudentChange(student.studentId)}
                                    />
                                    {student.name} ({student.birth_date})
                                </label>
                            </div>
                        ))}
                    </div>
                    <label>강의실:</label>
                    <input
                        type="text"
                        value={classroom}
                        onChange={(e) => setClassroom(e.target.value)}
                        style={inputStyle}
                    />
                </div>

                <div style={{ flex: 1, paddingLeft: '20px' }}>
                    <h2>할 일 관리</h2>
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        dateFormat="yyyy-MM-dd"
                        inline
                        dayClassName={(date) => {
                            const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
                            const dayMap = {
                                0: 'SUNDAY',
                                1: 'MONDAY',
                                2: 'TUESDAY',
                                3: 'WEDNESDAY',
                                4: 'THURSDAY',
                                5: 'FRIDAY',
                                6: 'SATURDAY',
                            };
                            const englishDay = dayMap[dayOfWeek];
                            const formattedDate = date.toISOString().split('T')[0];
                            const hasTodo = todos.some(todo => todo.date === formattedDate);

                            if (hasTodo) {
                                return 'selected-day-with-todo';
                            } else if (daysOfWeek.includes(englishDay)) {
                                return 'selected-day-no-todo';
                            }
                            return undefined;
                        }}
                    />
                    {selectedDate && (
                        <div style={{ marginTop: '20px' }}>
                            <h3>{selectedDate.toLocaleDateString()} 할 일</h3>
                            <button onClick={handleAddTodoForSelectedDate} style={{ padding: '5px 10px', backgroundColor: '#008CBA', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', marginBottom: '10px' }}>할 일 추가</button>
                            {todosForSelectedDate.length > 0 ? (
                                todosForSelectedDate.map((todo, index) => (
                                    <div key={todo.date + index} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #eee', borderRadius: '5px' }}> {/* key 변경 */}
                                        <label>제목:</label> {/* 별칭 -> 제목 */}
                                        <input
                                            type="text"
                                            value={todo.title} // alias -> title
                                            onChange={(e) => handleTodoChange(todo, 'title', e.target.value)} // alias -> title
                                            style={inputStyle}
                                        />
                                        <label>내용:</label> {/* 세부 목록 -> 내용 */}
                                        <input
                                            type="text"
                                            value={todo.task} // items -> task
                                            onChange={(e) => handleTodoChange(todo, 'task', e.target.value)} // items -> task
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

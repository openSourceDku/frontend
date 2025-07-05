import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getTodosByClassIdAndMonth } from '../../api/teacher';

function CheckTodo() {
  const { classId } = useParams();
  const [currentDate, setCurrentDate] = useState(new Date()); // Tracks the month displayed on the calendar
  const [todos, setTodos] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null); // Tracks the date selected by the user

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1; // Month is 0-indexed
        const response = await getTodosByClassIdAndMonth(classId, year, month);
        setTodos(response.todos);
      } catch (error) {
        console.error('Error fetching todos:', error);
        setTodos([]); // Clear todos on error
      }
    };
    fetchTodos();
  }, [classId, currentDate]);

  const getDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month - 1, 1).getDay(); // 0 for Sunday, 1 for Monday, etc.
  };

  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const numDays = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month); // Day of week for the 1st of the month

    const days = [];

    // Add leading empty days for alignment
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} style={styles.calendarDayEmpty}></div>);
    }

    // Add days of the month
    for (let i = 1; i <= numDays; i++) {
      const fullDate = `${year}-${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const hasTodo = todos.some(todo => todo.date === fullDate);
      const isSelected = selectedDate === fullDate;

      days.push(
        <div
          key={i}
          style={{
            ...styles.calendarDay,
            ...(hasTodo && styles.calendarDayWithTodo),
            ...(isSelected && styles.calendarDaySelected),
          }}
          onClick={() => setSelectedDate(fullDate)}
        >
          {i}
        </div>
      );
    }
    return days;
  };

  const handlePrevMonth = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
    setSelectedDate(null); // Reset selected date when month changes
  };

  const handleNextMonth = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
    setSelectedDate(null); // Reset selected date when month changes
  };

  const filteredTodos = selectedDate
    ? todos.filter(todo => todo.date === selectedDate)
    : [];

  return (
    <div style={styles.container}>
      <h1>할 일 확인 (반 ID: {classId})</h1>

      <div style={styles.contentWrapper}>
        {/* Calendar Section */}
        <div style={styles.calendarSection}>
          <div style={styles.calendarHeader}>
            <button onClick={handlePrevMonth} style={styles.navButton}>&lt;</button>
            <h2>{currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월</h2>
            <button onClick={handleNextMonth} style={styles.navButton}>&gt;</button>
          </div>
          <div style={styles.calendarGrid}>
            {['일', '월', '화', '수', '목', '금', '토'].map(day => (
              <div key={day} style={styles.calendarWeekday}>{day}</div>
            ))}
            {renderCalendarDays()}
          </div>
        </div>

        {/* Todo List Section */}
        <div style={styles.todoListSection}>
          <h2>{selectedDate ? `${selectedDate} 할 일` : '날짜를 선택하세요'}</h2>
          {filteredTodos.length > 0 ? (
            filteredTodos.map((todo, index) => (
              <div key={index} style={styles.todoItem}>
                <h3>{todo.todoTitle}</h3>
                <p>{todo.description}</p>
              </div>
            ))
          ) : (
            selectedDate && <p>선택된 날짜에 할 일이 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  contentWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
  },
  calendarSection: {
    width: '48%',
    border: '1px solid #ccc',
    padding: '15px',
    borderRadius: '8px',
  },
  calendarHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  navButton: {
    padding: '8px 15px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  calendarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '5px',
  },
  calendarWeekday: {
    textAlign: 'center',
    fontWeight: 'bold',
    padding: '10px 0',
    borderBottom: '1px solid #eee',
  },
  calendarDay: {
    textAlign: 'center',
    padding: '10px 0',
    border: '1px solid #eee',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  calendarDayEmpty: {
    // For empty cells in the calendar grid
  },
  calendarDayWithTodo: {
    fontWeight: 'bold',
    backgroundColor: '#e6f7ff', // Light blue background for days with todos
  },
  calendarDaySelected: {
    backgroundColor: '#007bff',
    color: 'white',
  },
  todoListSection: {
    width: '48%',
    border: '1px solid #ccc',
    padding: '15px',
    borderRadius: '8px',
    maxHeight: '500px',
    overflowY: 'auto',
  },
  todoItem: {
    borderBottom: '1px solid #eee',
    paddingBottom: '10px',
    marginBottom: '10px',
  },
};

export default CheckTodo;
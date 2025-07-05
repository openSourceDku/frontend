import { useEffect, useState } from  'react';
import { useNavigate } from 'react-router-dom';
import { getTeacherClasses } from '../../api/teacher';

function ClassSelection() {
  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getTeacherClasses().then(setClasses);
  }, []);

  const handleClassClick = (classId) => {
    navigate(`/teacher/class/${classId}/tasks`);
  };

  return (
    <div style={styles.container}>
      <h1>반 선택</h1>
      <div style={styles.buttonContainer}>
        {classes.map((classItem) => (
          <div
            key={classItem.id}
            style={styles.button}
            onClick={() => handleClassClick(classItem.id)}
          >
            {classItem.name}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    textAlign: 'center',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginTop: '20px',
  },
  button: {
    padding: '15px 25px',
    fontSize: '18px',
    backgroundColor: '#ffffff',
    color: '#333333',
    border: '1px solid #cccccc',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease',
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    '&:hover': {
      backgroundColor: '#f0f0f0',
      borderColor: '#999999',
    },
  },
};

export default ClassSelection;

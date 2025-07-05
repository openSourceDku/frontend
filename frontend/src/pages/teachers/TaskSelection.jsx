import { useParams, useNavigate } from 'react-router-dom';

function TaskSelection() {
  const { classId } = useParams();
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(`/teacher/class/${classId}/tasks/${path}`);
  };

  return (
    <div style={styles.container}>
      <h1>무엇을 하시겠어요? (반 ID: {classId})</h1>
      <div style={styles.buttonContainer}>
        <div
          style={styles.button}
          onClick={() => handleNavigation('check-todo')}
        >
          할 일 확인
        </div>
        <div
          style={styles.button}
          onClick={() => handleNavigation('send-report')}
        >
          리포트 전송
        </div>
        <div
          style={styles.button}
          onClick={() => handleNavigation('check-equipment')}
        >
          비품 확인
        </div>
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

export default TaskSelection;

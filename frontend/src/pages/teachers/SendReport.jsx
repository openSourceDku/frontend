import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getStudentsByClassId, sendReport } from '../../api/teacher';

function SendReport() {
  const { classId } = useParams();
  const [students, setStudents] = useState([]);
  const [commonSubject, setCommonSubject] = useState('');
  const [commonContent, setCommonContent] = useState('');
  const [individualMessages, setIndividualMessages] = useState({});
  const [selectedStudents, setSelectedStudents] = useState({});

  useEffect(() => {
    getStudentsByClassId(classId).then((data) => {
      setStudents(data.students);
      const initialSelected = {};
      data.students.forEach(student => {
        initialSelected[student.studentId] = false;
      });
      setSelectedStudents(initialSelected);
    });
  }, [classId]);

  const handleCommonSubjectChange = (e) => {
    setCommonSubject(e.target.value);
  };

  const handleCommonContentChange = (e) => {
    setCommonContent(e.target.value);
  };

  const handleIndividualMessageChange = (studentId, message) => {
    setIndividualMessages(prev => ({
      ...prev,
      [studentId]: message,
    }));
  };

  const handleStudentSelect = (studentId) => {
    setSelectedStudents(prev => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  const handleSubmit = async () => {
    const recipients = students
      .filter(student => selectedStudents[student.studentId])
      .map(student => ({
        studentId: student.studentId,
        personalMessage: individualMessages[student.studentId] || '',
      }));

    const reportData = {
      common: {
        subject: commonSubject,
        content: commonContent,
      },
      recipients: recipients,
    };

    try {
      const response = await sendReport(reportData);
      alert(`Report sent successfully! Status: ${response.status}, Common: ${response.sentCommon}, Individual: ${response.sentIndividual}`);
      console.log('Report send response:', response);
    } catch (error) {
      alert('Failed to send report.');
      console.error('Error sending report:', error);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>리포트 작성 및 전송 (반 ID: {classId})</h1>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        {/* Common Message Section */}
        <div style={{ width: '48%', border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
          <h2>전체 전달 사항 작성</h2>
          <input
            type="text"
            placeholder="제목"
            value={commonSubject}
            onChange={handleCommonSubjectChange}
            style={{ width: 'calc(100% - 20px)', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
          <textarea
            placeholder="내용"
            value={commonContent}
            onChange={handleCommonContentChange}
            rows="10"
            style={{ width: 'calc(100% - 20px)', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
          ></textarea>
        </div>

        {/* Individual Message Section */}
        <div style={{ width: '48%', border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
          <h2>개별 전달 사항 작성</h2>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {students.map((student) => (
              <div key={student.studentId} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
                <input
                  type="checkbox"
                  checked={selectedStudents[student.studentId]}
                  onChange={() => handleStudentSelect(student.studentId)}
                  style={{ marginRight: '10px' }}
                />
                <span style={{ width: '80px' }}>{student.studentName}</span>
                <input
                  type="text"
                  placeholder="개별 전달사항"
                  value={individualMessages[student.studentId] || ''}
                  onChange={(e) => handleIndividualMessageChange(student.studentId, e.target.value)}
                  disabled={!selectedStudents[student.studentId]}
                  style={{ flexGrow: '1', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
        <button
          onClick={handleSubmit}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          전송
        </button>
      </div>
    </div>
  );
}

export default SendReport;

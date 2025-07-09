import React, { useState, useEffect } from 'react';

const StudentFormModal = ({ show, onClose, onSave, student }) => {
    const [studentData, setStudentData] = useState({
        class_id: '',
        name: '',
        birth_date: '',
        email: '',
        gender: ''
    });

    useEffect(() => {
        if (student) {
            setStudentData(student);
        } else {
            setStudentData({
                class_id: '',
                name: '',
                birth_date: '',
                email: '',
                gender: ''
            });
        }
    }, [student]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setStudentData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = () => {
        console.log("Submitting student data:", studentData);
        onSave(studentData);
        onClose(); // Close modal after save
    };

    if (!show) {
        return null;
    }

    return (
        <div style={modalOverlayStyle}>
            <div style={modalContentStyle}>
                <h2>{student ? '학생 수정' : '학생 등록'}</h2>
                <div style={inputGroupStyle}>
                    <label style={labelStyle}>Class ID</label>
                    <input type="number" name="class_id" value={studentData.class_id} onChange={handleInputChange} style={inputStyle} />
                </div>
                <div style={inputGroupStyle}>
                    <label style={labelStyle}>Name</label>
                    <input type="text" name="name" value={studentData.name} onChange={handleInputChange} style={inputStyle} />
                </div>
                <div style={inputGroupStyle}>
                    <label style={labelStyle}>Birth Date</label>
                    <input type="date" name="birth_date" value={studentData.birth_date} onChange={handleInputChange} style={inputStyle} />
                </div>
                <div style={inputGroupStyle}>
                    <label style={labelStyle}>Email</label>
                    <input type="email" name="email" value={studentData.email} onChange={handleInputChange} style={inputStyle} />
                </div>
                <div style={inputGroupStyle}>
                    <label style={labelStyle}>Gender</label>
                    <select name="gender" value={studentData.gender} onChange={handleInputChange} style={inputStyle}>
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
                <div style={buttonContainerStyle}>
                    <button onClick={handleSubmit} style={saveButtonStyle}>저장</button>
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
    zIndex: 1000,
};

const modalContentStyle = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    width: '400px',
    maxHeight: '90vh',
    overflowY: 'auto',
};

const inputGroupStyle = {
    marginBottom: '15px',
};

const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
};

const inputStyle = {
    width: '100%',
    padding: '8px',
    boxSizing: 'border-box',
    border: '1px solid #ccc',
    borderRadius: '4px',
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

const cancelButtonStyle = {
    padding: '8px 15px',
    backgroundColor: '#cccccc',
    color: 'black',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
};

export default StudentFormModal;

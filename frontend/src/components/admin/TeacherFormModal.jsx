import React, { useState, useEffect } from 'react';

const TeacherFormModal = ({ show, onClose, onSave, teacher }) => {
  /* ---------- 상태 ---------- */
  const [form, setForm] = useState({
    id:         '',   // 서버 PK (수정 시에만)
    teacherId:  '',   // 로그인용 ID
    passwd:     '',
    name:       '',
    age:        '',
    position:   '',
    sex:        ''
  });

  /* ---------- teacher prop 변경 시 초기화 ---------- */
  useEffect(() => {
    if (teacher) {
      // 비밀번호는 보안상 비워 둠
      setForm({ ...teacher, passwd: '' });
    } else {
      setForm({
        id: '', teacherId:'', passwd:'', name:'',
        age:'', position:'', sex:''
      });
    }
  }, [teacher]);

  /* ---------- 입력 핸들러 ---------- */
  const onChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  /* ---------- 저장 ---------- */
  const submit = () => {
    const data = { ...form };

    // 새 등록이면 id 제거
    if (!data.id) delete data.id;

    // age를 숫자로
    data.age = parseInt(data.age, 10) || 0;

    onSave(data);
    onClose();
  };

  if (!show) return null;

  /* ---------- JSX ---------- */
  return (
    <div style={ov}>
      <div style={box}>
        <h2>{teacher ? '선생 수정' : '선생 등록'}</h2>

        <label style={lb}>Teacher ID</label>
        <input
          style={inp}
          name="teacherId"
          value={form.teacherId}
          onChange={onChange}
          readOnly={!!teacher}   /* 수정 모드일 땐 변경 불가 */
        />

        <label style={lb}>Password</label>
        <input
          style={inp}
          type="password"
          name="passwd"
          placeholder={teacher ? '비워두면 기존 비밀번호 유지' : ''}
          value={form.passwd}
          onChange={onChange}
        />

        <label style={lb}>Name</label>
        <input
          style={inp}
          name="name"
          value={form.name}
          onChange={onChange}
        />

        <label style={lb}>Age</label>
        <input
          style={inp}
          type="number"
          name="age"
          value={form.age}
          onChange={onChange}
        />

        <label style={lb}>Position</label>
        <input
          style={inp}
          name="position"
          value={form.position}
          onChange={onChange}
        />

        <label style={lb}>Sex</label>
        <select
          style={inp}
          name="sex"
          value={form.sex}
          onChange={onChange}
        >
          <option value="">Select Sex</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <div style={btnGrp}>
          <button style={btnSave} onClick={submit}>저장</button>
          <button style={btnCancel} onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
};

/* ---------- 스타일 ---------- */
const ov   = { position:'fixed',inset:0,display:'flex',alignItems:'center',
               justifyContent:'center',background:'rgba(0,0,0,.5)',zIndex:1000 };
const box  = { background:'#fff',padding:20,borderRadius:8,width:400,maxHeight:'90vh',
               overflowY:'auto' };
const lb   = { display:'block',marginBottom:5,fontWeight:'bold' };
const inp  = { width:'100%',padding:8,marginBottom:15,boxSizing:'border-box',
               border:'1px solid #ccc',borderRadius:4 };
const btnGrp   = { display:'flex',justifyContent:'flex-end',gap:10,marginTop:20 };
const btnSave  = { padding:'8px 15px',background:'#4CAF50',color:'#fff',
                   border:'none',borderRadius:5,cursor:'pointer' };
const btnCancel= { ...btnSave,background:'#ccc',color:'#000' };

export default TeacherFormModal;

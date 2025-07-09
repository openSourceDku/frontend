import React, { useState, useEffect } from 'react';

export default function StudentFormModal({ show, onClose, onSave, student }) {
  const [form, setForm] = useState({
    id:        '',   // 서버 PK (수정 때만)
    classId:   '',   // 선택
    name:      '',
    birthDate: '',
    email:     '',
    gender:    ''
  });

  /* prop → state */
  useEffect(() => {
    if (student) {
      setForm({
        id:        student.id,      // PK
        classId:   student.class_id || '',
        name:      student.name || '',
        birthDate: student.birth_date || '',
        email:     student.email || '',
        gender:    student.gender || ''
      });
    } else {
      setForm({ id:'', classId:'', name:'', birthDate:'', email:'', gender:'' });
    }
  }, [student]);

  const onChange = e => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
  };

  const submit = () => {
    const payload = { ...form };
    if (!payload.id) delete payload.id;     // 새 등록이면 id 제거
    onSave(payload);
    onClose();
  };

  if (!show) return null;

  return (
    <>
      <style>{`
        .ov{position:fixed;inset:0;display:flex;justify-content:center;align-items:center;background:rgba(0,0,0,.5);z-index:1000;}
        .box{background:#fff;padding:20px;border-radius:8px;width:400px;max-height:90vh;overflow-y:auto;}
        .grp{margin-bottom:15px;}
        .lb{display:block;margin-bottom:5px;font-weight:bold;}
        .in{width:100%;padding:8px;box-sizing:border-box;border:1px solid #ccc;border-radius:4px;}
        .btns{display:flex;gap:10px;justify-content:flex-end;margin-top:20px;}
        .sv{padding:8px 15px;background:#4CAF50;color:#fff;border:none;border-radius:5px;cursor:pointer;}
        .cl{padding:8px 15px;background:#ccc;color:#000;border:none;border-radius:5px;cursor:pointer;}
      `}</style>

      <div className="ov">
        <div className="box">
          <h2>{student ? '학생 수정' : '학생 등록'}</h2>

          <div className="grp">
            <label className="lb">Class&nbsp;ID&nbsp;(옵션)</label>
            <input className="in" name="classId" type="number"
                   value={form.classId} onChange={onChange} />
          </div>

          <div className="grp">
            <label className="lb">Name</label>
            <input className="in" name="name"
                   value={form.name} onChange={onChange} />
          </div>

          <div className="grp">
            <label className="lb">Birth&nbsp;Date</label>
            <input className="in" name="birthDate" type="date"
                   value={form.birthDate} onChange={onChange} />
          </div>

          <div className="grp">
            <label className="lb">Email</label>
            <input className="in" name="email" type="email"
                   value={form.email} onChange={onChange} />
          </div>

          <div className="grp">
            <label className="lb">Gender</label>
            <select className="in" name="gender"
                    value={form.gender} onChange={onChange}>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="btns">
            <button className="sv" onClick={submit}>저장</button>
            <button className="cl" onClick={onClose}>취소</button>
          </div>
        </div>
      </div>
    </>
  );
}

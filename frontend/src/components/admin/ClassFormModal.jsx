// src/components/ClassFormModal.jsx
import React, { useState, useEffect, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getStudents } from '../../api/admin';

/* YYYY-MM-DD (로컬) */
const toKey = d => {
  const date = new Date(d);
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0')
  ].join('-');
};

export default function ClassFormModal({
  show, onClose, onSave, onDelete, classData, allTeachers
}) {
  /* ─── state ─── */
  const [className, setClassName]           = useState('');
  const [daysOfWeek, setDaysOfWeek]         = useState([]);
  const [allStudents, setAllStudents]       = useState([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [todos, setTodos]                   = useState([]);
  const [selectedDate, setSelectedDate]     = useState(new Date());
  const [selectedTeacherId, setSelectedTeacherId]   = useState('');
  const [searchTerm, setSearchTerm]         = useState('');
  const [classroom, setClassroom]           = useState('');

  /* 선택 날짜의 todo */
  const todayTodos = useMemo(
    () => todos.filter(t => t.date === toKey(selectedDate)),
    [todos, selectedDate]
  );

  /* 학생 필터 */
  const filteredStudents = useMemo(
    () => allStudents.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [allStudents, searchTerm]
  );

  /* 학생 목록 로드 */
  useEffect(() => {
    getStudents()
      .then(r => setAllStudents(r.data.students || []))
      .catch(console.error);
  }, []);

  /* classData → state 초기화 */
  useEffect(() => {
    if (classData) {
      setClassName(classData.className || '');
      setSelectedTeacherId(classData.teacher?.id || '');
      setDaysOfWeek(classData.daysOfWeek || []);
      const initialSelectedStudentIds = classData.students?.map(s => s.id) || [];
      setSelectedStudentIds(initialSelectedStudentIds);
      console.log('ClassFormModal: Initial selected student IDs:', initialSelectedStudentIds);
      setTodos((classData.todos || []).map(t => ({
        date : (t.date || '').toString().slice(0,10),
        title: t.title || t.todoTitle || '',
        task : t.task  || t.description || ''
      })));
      setClassroom(classData.classroom || '');
    } else {
      setClassName(''); setSelectedTeacherId('');
      setDaysOfWeek([]); setSelectedStudentIds([]);
      setTodos([]); setClassroom('');
    }
    setSelectedDate(new Date());
  }, [classData]);

  /* ─── handlers ─── */
  const toggleStudent = id =>{
    console.log('ClassFormModal: Toggling student ID:', id);
    setSelectedStudentIds(p => {
      const newState = p.includes(id) ? p.filter(x=>x!==id) : [...p,id];
      console.log('ClassFormModal: New selected student IDs state:', newState);
      return newState;
    });
  };

  const addTodo = () => {
    if (todayTodos.length) return;
    setTodos(p => [...p, { date: toKey(selectedDate), title:'', task:'' }]);
  };

  const editTodo = (idx, field, val) => {
    const key = toKey(selectedDate);
    setTodos(p => {
      const today  = p.filter(t => t.date === key);
      const other  = p.filter(t => t.date !== key);
      today[idx]   = { ...today[idx], [field]: val };
      return [...other, ...today];
    });
  };

  const delTodo = idx => {
    const key = toKey(selectedDate);
    setTodos(p => {
      const today  = p.filter(t => t.date === key);
      const other  = p.filter(t => t.date !== key);
      today.splice(idx,1);
      return [...other, ...today];
    });
  };

  const submit = () => {
    const payload = {
      className,
      teacher : selectedTeacherId ? { id: selectedTeacherId } : null,
      daysOfWeek,
      students: selectedStudentIds.map(id=>{
        const s = allStudents.find(u=>u.id===id);
        return s ? { id:id, name:s.name } : null;
      }).filter(Boolean),
      todos,
      classroom
    };
    console.log('ClassFormModal: Payload being sent:', payload);
    onSave(payload);
    onClose();
  };

  if (!show) return null;

  /* ─── JSX ─── */
  return (
    <>
      <style>{`
        .ov{position:fixed;inset:0;display:flex;justify-content:center;align-items:center;background:rgba(0,0,0,.5);z-index:1000;}
        .mo{background:#fff;padding:20px;border-radius:8px;display:flex;gap:20px;width:900px;max-height:90vh;overflow-y:auto;}
        .col{flex:1;}
        .in{width:100%;padding:8px;margin:5px 0;box-sizing:border-box;}
        .week{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:10px;}
        .stu{list-style:none;padding:0;max-height:150px;overflow-y:auto;margin-bottom:10px;}
        .stu li{display:flex;align-items:center;border-bottom:1px solid #eee;padding:5px 0;}
        .stu input{margin-right:8px;}
        .btn{padding:5px 10px;border:none;border-radius:3px;cursor:pointer;}
        .add{background:#008CBA;color:#fff;margin-bottom:10px;}
        .rm{background:#f44336;color:#fff;margin-top:5px;}
        .grp{display:flex;gap:10px;justify-content:flex-end;margin-top:20px;}
        .sv{background:#4CAF50;color:#fff;} .dl{background:#f44336;color:#fff;} .cl{background:#ccc;color:#000;}
        .has{background:#ffe0b2!important;border-radius:50%!important;color:#000!important;}
      `}</style>

      <div className="ov">
        <div className="mo">

          {/* 왼쪽 */}
          <div className="col">
            <h2>{classData ? '반 수정' : '반 등록'}</h2>

            <label>반 이름:</label>
            <input className="in" value={className} onChange={e=>setClassName(e.target.value)} />

            <label>담당 교사:</label>
            <select className="in" value={selectedTeacherId}
                    onChange={e=>setSelectedTeacherId(Number(e.target.value))}>
              <option value="">교사 선택</option>
              {allTeachers.map(t=>(
                <option key={t.id} value={t.id}>
                  {t.teacherId} / {t.name}
                </option>
              ))}
            </select>

            <label>수업 요일:</label>
            <div className="week">
              {['월','화','수','목','금','토','일'].map(d=>{
                const eng={월:'MONDAY',화:'TUESDAY',수:'WEDNESDAY',
                           목:'THURSDAY',금:'FRIDAY',토:'SATURDAY',일:'SUNDAY'}[d];
                return (
                  <label key={d}><input type="checkbox"
                    checked={daysOfWeek.includes(eng)}
                    onChange={e=>{
                      if(e.target.checked) setDaysOfWeek([...daysOfWeek,eng]);
                      else setDaysOfWeek(daysOfWeek.filter(x=>x!==eng));
                    }}/> {d}</label>
                );
              })}
            </div>

            <label>학생 등록:</label>
            <input className="in" placeholder="이름으로 검색"
                   value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} />
            <ul className="stu">
              {filteredStudents.map(s=>{
                console.log('ClassFormModal: Rendering student checkbox for ID:', s.id, 'checked:', selectedStudentIds.includes(s.id));
                return (
                <li key={s.id}>
                  <input type="checkbox"
                         checked={selectedStudentIds.includes(s.id)}
                         onChange={()=>toggleStudent(s.id)} />
                  {s.name}
                </li>
              );})}
            </ul>

            <label>강의실:</label>
            <input className="in" value={classroom} onChange={e=>setClassroom(e.target.value)} />
          </div>

          {/* 오른쪽 */}
          <div className="col">
            <h2>할 일 관리</h2>

            <DatePicker
              inline
              selected={selectedDate}
              onChange={setSelectedDate}
              dateFormat="yyyy-MM-dd"
              dayClassName={d=>todos.some(t=>t.date===toKey(d))?'has':undefined}
            />

            <h3>{selectedDate.toLocaleDateString()} 할 일</h3>
            {todayTodos.length === 0 && <button className="btn add" onClick={addTodo}>할 일 추가</button>}

            {todayTodos.length ? todayTodos.map((t,i)=>(
              <div key={i} style={{marginBottom:'10px'}}>
                <label>제목:</label>
                <input className="in" value={t.title}
                       onChange={e=>editTodo(i,'title',e.target.value)} />
                <label>내용:</label>
                <input className="in" value={t.task}
                       onChange={e=>editTodo(i,'task',e.target.value)} />
                <button className="btn rm" onClick={()=>delTodo(i)}>삭제</button>
              </div>
            )) : <p>선택된 날짜에 할 일이 없습니다.</p>}

            <div className="grp">
              <button className="btn sv" onClick={submit}>저장</button>
              {classData &&
                <button className="btn dl" onClick={()=>onDelete(classData.classId)}>삭제</button>}
              <button className="btn cl" onClick={onClose}>취소</button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

import { useEffect, useState } from 'react'

function App() {
  const [students, setStudents] = useState([])
  const [form, setForm] = useState({ studentId: '', name: '', email: '' })
  const [editingId, setEditingId] = useState(null)

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/students')
      const data = await res.json()
      setStudents(data)
    } catch (err) {
      console.error('Lỗi lấy dữ liệu:', err)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.studentId || !form.name || !form.email) return

    if (editingId) {
      await fetch(`/api/students/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      setEditingId(null)
    } else {
      await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
    }

    setForm({ studentId: '', name: '', email: '' })
    fetchStudents()
  }

  const handleEdit = (student) => {
    setEditingId(student._id)
    setForm({ studentId: student.studentId, name: student.name, email: student.email })
  }

  const handleDelete = async (id) => {
    await fetch(`/api/students/${id}`, { method: 'DELETE' })
    fetchStudents()
  }

  return (
    <div style={{ maxWidth: '700px', margin: '40px auto', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center' }}>Quản Lý Sinh Viên (MERN Stack)</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="MSSV"
          value={form.studentId}
          onChange={(e) => setForm({ ...form, studentId: e.target.value })}
          style={{ padding: '8px', flex: '1' }}
        />
        <input
          type="text"
          placeholder="Họ và tên"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          style={{ padding: '8px', flex: '1' }}
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          style={{ padding: '8px', flex: '1' }}
        />
        <button type="submit" style={{ padding: '8px 16px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%' }}>
          {editingId ? 'Cập Nhật Sinh Viên' : 'Thêm Sinh Viên'}
        </button>
      </form>

      <h3 style={{ textAlign: 'center' }}>Danh Sách Sinh Viên</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {students.map((st) => (
          <div key={st._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid #ddd' }}>
            <div>
              <strong>{st.studentId}</strong> - {st.name} ({st.email})
            </div>
            <div style={{ display: 'flex', gap: '5px' }}>
              <button onClick={() => handleEdit(st)} style={{ padding: '5px 10px', background: '#eee', border: '1px solid #ccc', borderRadius: '3px', cursor: 'pointer' }}>Sửa</button>
              <button onClick={() => handleDelete(st._id)} style={{ padding: '5px 10px', background: '#f44336', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Xóa</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
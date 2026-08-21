const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose'); 

const app = express();
app.use(cors());
app.use(express.json());

// ==========================================
// CÂU 33: Kết nối Express Backend với MongoDB
// ==========================================
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully!'))
  .catch((err) => console.error('MongoDB connection error:', err));

// ==========================================
// CÂU 35: Tạo Model Student
// ==========================================
const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true }
});
const Student = mongoose.model('Student', studentSchema);

// Câu 22: Tạo API GET /api/hello
app.get('/api/hello', (req, res) => {
  res.json({ message: "Backend đang hoạt động!" });
});

// Câu 21: Xây dựng Express Server chạy trên port 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// ==========================================
// CÂU 36: API GET /api/students (Lấy danh sách)
// ==========================================
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// CÂU 37: API POST /api/students (Thêm sinh viên)
// ==========================================
app.post('/api/students', async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ==========================================
// CÂU 38: API PUT /api/students/:id (Cập nhật)
// ==========================================
app.put('/api/students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ==========================================
// CÂU 39: API DELETE /api/students/:id (Xóa)
// ==========================================
app.delete('/api/students/:id', async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Xóa sinh viên thành công!' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
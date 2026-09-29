const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = "mongodb+srv://s238178_db_user:nhan2112@cluster0.hlusspf.mongodb.net/cloud_lab?retryWrites=true&w=majority";

const StudentSchema = new mongoose.Schema({ studentId: String, name: String, email: String });
// Đã sửa 'student' thành 'students' để khớp với bảng dữ liệu thật trên Atlas của bạn
const Student = mongoose.model('Student', StudentSchema, 'students');

mongoose.connect(MONGO_URI)
  .then(() => console.log('===> KET NOI ATLAS THANH CONG <==='))
  .catch(err => console.error('===> LOI ATLAS:', err.message));

app.get(['/api/students', '/students'], async (req, res) => {
  try { res.json(await Student.find()); } 
  catch (err) { res.status(500).json({ error: err.message }); }
});

app.post(['/api/students', '/students'], async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8"><title>Quản Lý Sinh Viên</title>
    <style>
        body { font-family: Arial; background: #121212; color: #fff; text-align: center; padding: 40px; }
        input { padding: 10px; margin: 5px; width: 200px; }
        button { padding: 10px 20px; background: #4CAF50; color: white; cursor: pointer; width: 630px; }
        table { margin: 30px auto; border-collapse: collapse; width: 650px; background: #1e1e1e; }
        th, td { padding: 12px; border: 1px solid #333; }
        th { background: #2a2a2a; }
        #msg { margin-top: 10px; font-weight: bold; }
    </style>
</head>
<body>
    <h2>Quản Lý Sinh Viên (Atlas - Collection: students)</h2>
    <div>
        <input type="text" id="studentId" placeholder="Mã SV" value="238178">
        <input type="text" id="name" placeholder="Tên SV" value="Trần Trí Nhân">
        <input type="email" id="email" placeholder="Email" value="s238178@nctu.edu.vn"><br>
        <button onclick="addStudent()">Thêm Sinh Viên</button>
        <div id="msg"></div>
    </div>
    <table>
        <thead><tr><th>Mã SV</th><th>Tên Sinh Viên</th><th>Email</th></tr></thead>
        <tbody id="student-list"></tbody>
    </table>
    <script>
        async function load() {
            const msg = document.getElementById('msg');
            try {
                const res = await fetch('/students');
                const data = await res.json();
                if(res.ok) {
                    document.getElementById('student-list').innerHTML = data.map(s => \`<tr><td>\${s.studentId||''}</td><td>\${s.name||''}</td><td>\${s.email||''}</td></tr>\`).join('');
                    msg.style.color = '#4CAF50';
                    msg.innerText = 'Kết nối Database thành công! Đã tải ' + data.length + ' sinh viên.';
                } else {
                    msg.style.color = '#f44336';
                    msg.innerText = 'Lỗi DB: ' + data.error;
                }
            } catch (e) {
                msg.style.color = '#f44336';
                msg.innerText = 'Backend lỗi kết nối Database!';
            }
        }
        async function addStudent() {
            const studentId = document.getElementById('studentId').value;
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const msg = document.getElementById('msg');
            msg.style.color = '#ffeb3b';
            msg.innerText = 'Đang lưu vào Atlas...';
            try {
                const res = await fetch('/students', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ studentId, name, email })
                });
                if(res.ok) {
                    msg.style.color = '#4CAF50';
                    msg.innerText = 'Đã thêm dữ liệu thành công!';
                    load();
                } else {
                    const errData = await res.json();
                    msg.style.color = '#f44336';
                    msg.innerText = 'Lỗi lưu dữ liệu: ' + errData.error;
                }
            } catch (e) {
                msg.style.color = '#f44336';
                msg.innerText = 'Lỗi gọi API thêm sinh viên!';
            }
        }
        load();
    </script>
</body>
</html>
`);
});
app.listen(process.env.PORT || 5000, () => console.log('Server running'));

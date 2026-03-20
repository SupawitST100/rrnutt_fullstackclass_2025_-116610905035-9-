const router = require('express').Router();
const jwt = require('jsonwebtoken');
const pool = require('../db');
const { JWT_SECRET } = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { firstname, lastname, email, password, phone } = req.body;
    if (!firstname || !lastname || !email || !password)
      return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });

    const exists = await pool.query('SELECT id FROM customers WHERE email=$1', [email]);
    if (exists.rows.length) return res.status(409).json({ message: 'อีเมลนี้ถูกใช้งานแล้ว' });

    const result = await pool.query(
      `INSERT INTO customers (firstname,lastname,email,password_hash,phone) VALUES($1,$2,$3,$4,$5) RETURNING id,firstname,lastname,email,phone,created_at`,
      [firstname, lastname, email, password, phone || null]
    );
    const customer = result.rows[0];
    customer.role = 'user';
    const token = jwt.sign({ id: customer.id, email: customer.email, role: 'user' }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, customer });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query(
      'SELECT id,firstname,lastname,email,phone,created_at,password_hash FROM customers WHERE email=$1',
      [email]
    );
    if (!result.rows.length) return res.status(401).json({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });

    const customer = result.rows[0];
    if (customer.password_hash !== password)
      return res.status(401).json({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });

    delete customer.password_hash;
    // admin ถ้า email เป็น admin@travel.com
    customer.role = customer.email === 'admin@travel.com' ? 'admin' : 'user';
    const token = jwt.sign({ id: customer.id, email: customer.email, role: customer.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, customer });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  }
});

module.exports = router;
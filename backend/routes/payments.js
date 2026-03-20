const router = require('express').Router();
const pool = require('../db');
const { authenticate, adminOnly } = require('../middleware/auth');

router.get('/', authenticate, adminOnly, async (req, res) => {
  const r = await pool.query('SELECT p.*, b.customer_id FROM payments p JOIN bookings b ON p.booking_id=b.id ORDER BY p.transaction_date DESC');
  res.json(r.rows);
});

router.post('/', authenticate, async (req, res) => {
  const { booking_id, payment_method, amount } = req.body;
  const r = await pool.query(
    'INSERT INTO payments(booking_id,payment_method,amount) VALUES($1,$2,$3) RETURNING *',
    [booking_id, payment_method, amount]
  );
  res.status(201).json(r.rows[0]);
});
module.exports = router;

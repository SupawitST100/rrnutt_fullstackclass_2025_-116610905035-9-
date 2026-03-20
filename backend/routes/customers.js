const router = require('express').Router();
const pool = require('../db');
const { authenticate, adminOnly } = require('../middleware/auth');

router.get('/', authenticate, adminOnly, async (req, res) => {
  const r = await pool.query(
    'SELECT id,firstname,lastname,email,phone,created_at FROM customers ORDER BY created_at DESC'
  );
  res.json(r.rows);
});

router.get('/:id', authenticate, async (req, res) => {
  if (parseInt(req.params.id) !== req.user.id && req.user.role !== 'admin')
    return res.status(403).json({ message: 'Forbidden' });
  const r = await pool.query(
    'SELECT id,firstname,lastname,email,phone,created_at FROM customers WHERE id=$1',
    [req.params.id]
  );
  if (!r.rows.length) return res.status(404).json({ message: 'Not found' });
  res.json(r.rows[0]);
});

router.put('/:id', authenticate, async (req, res) => {
  if (parseInt(req.params.id) !== req.user.id && req.user.role !== 'admin')
    return res.status(403).json({ message: 'Forbidden' });
  const { firstname, lastname, phone } = req.body;
  const r = await pool.query(
    'UPDATE customers SET firstname=$1,lastname=$2,phone=$3 WHERE id=$4 RETURNING id,firstname,lastname,email,phone,created_at',
    [firstname, lastname, phone, req.params.id]
  );
  res.json(r.rows[0]);
});

module.exports = router;
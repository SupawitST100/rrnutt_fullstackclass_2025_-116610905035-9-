const router = require('express').Router();
const pool = require('../db');
const { authenticate, adminOnly } = require('../middleware/auth');

// Admin: all bookings
router.get('/', authenticate, adminOnly, async (req, res) => {
  const r = await pool.query(`
    SELECT b.*, c.firstname||' '||c.lastname as customer_name
    FROM bookings b LEFT JOIN customers c ON b.customer_id=c.id
    ORDER BY b.booking_date DESC
  `);
  res.json(r.rows);
});

// User: my bookings
router.get('/my', authenticate, async (req, res) => {
  const r = await pool.query(`
    SELECT b.* FROM bookings b WHERE b.customer_id=$1 ORDER BY b.booking_date DESC
  `, [req.user.id]);
  // also fetch items
  for (const bk of r.rows) {
    const items = await pool.query('SELECT * FROM booking_items WHERE booking_id=$1', [bk.id]);
    bk.items = items.rows;
  }
  res.json(r.rows);
});

router.get('/:id', authenticate, async (req, res) => {
  const r = await pool.query('SELECT * FROM bookings WHERE id=$1', [req.params.id]);
  if (!r.rows.length) return res.status(404).json({ message: 'Not found' });
  const bk = r.rows[0];
  if (bk.customer_id !== req.user.id && req.user.role !== 'admin')
    return res.status(403).json({ message: 'Forbidden' });
  const items = await pool.query('SELECT * FROM booking_items WHERE booking_id=$1', [bk.id]);
  bk.items = items.rows;
  res.json(bk);
});

router.post('/', authenticate, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { items } = req.body; // [{item_type, item_id, quantity, price_at_booking}]
    const total = items.reduce((s, i) => s + i.price_at_booking * i.quantity, 0);
    const bk = await client.query(
      'INSERT INTO bookings(customer_id,total_amount) VALUES($1,$2) RETURNING *',
      [req.user.id, total]
    );
    const booking_id = bk.rows[0].id;
    for (const item of items) {
      await client.query(
        'INSERT INTO booking_items(booking_id,item_type,item_id,quantity,price_at_booking) VALUES($1,$2,$3,$4,$5)',
        [booking_id, item.item_type, item.item_id, item.quantity, item.price_at_booking]
      );
    }
    await client.query('COMMIT');
    res.status(201).json(bk.rows[0]);
  } catch (e) {
    await client.query('ROLLBACK');
    console.error(e);
    res.status(500).json({ message: 'เกิดข้อผิดพลาด' });
  } finally {
    client.release();
  }
});

router.patch('/:id/status', authenticate, async (req, res) => {
  const { status } = req.body;
  const r = await pool.query('UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *', [status, req.params.id]);
  res.json(r.rows[0]);
});

module.exports = router;

const router = require('express').Router();
const pool = require('../db');
const { authenticate, adminOnly } = require('../middleware/auth');

router.get('/', async (req, res) => {
  const r = await pool.query(`
    SELECT rv.*,
      c.firstname||' '||c.lastname as customer_name,
      CASE
        WHEN rv.item_type = 'Package' THEN p.title
        WHEN rv.item_type = 'Hotel'   THEN h.name
      END as item_name
    FROM reviews rv
    LEFT JOIN customers c  ON rv.customer_id = c.id
    LEFT JOIN packages  p  ON rv.item_type = 'Package' AND rv.item_id = p.id
    LEFT JOIN hotels    h  ON rv.item_type = 'Hotel'   AND rv.item_id = h.id
    ORDER BY rv.created_at DESC
  `);
  res.json(r.rows);
});

// GET /api/reviews/avg?item_type=Package&item_id=1
router.get('/avg', async (req, res) => {
  const { item_type, item_id } = req.query;
  const r = await pool.query(
    `SELECT COUNT(*) as count, ROUND(AVG(rating)::numeric, 1) as avg
     FROM reviews WHERE item_type=$1 AND item_id=$2`,
    [item_type, item_id]
  );
  res.json({ count: parseInt(r.rows[0].count), avg: parseFloat(r.rows[0].avg) || 0 });
});

router.post('/', authenticate, async (req, res) => {
  const { item_type, item_id, rating, comment } = req.body;
  const r = await pool.query(
    'INSERT INTO reviews(customer_id,item_type,item_id,rating,comment) VALUES($1,$2,$3,$4,$5) RETURNING *',
    [req.user.id, item_type, item_id, rating, comment]
  );
  res.status(201).json(r.rows[0]);
});

router.delete('/:id', authenticate, adminOnly, async (req, res) => {
  await pool.query('DELETE FROM reviews WHERE id=$1', [req.params.id]);
  res.json({ message: 'Deleted' });
});

module.exports = router;
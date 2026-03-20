const router = require('express').Router();
const pool = require('../db');
const { authenticate, adminOnly } = require('../middleware/auth');

router.get('/', async (req, res) => {
  const r = await pool.query(`
    SELECT p.*, d.name as destination_name, d.location as destination_location
    FROM packages p LEFT JOIN destinations d ON p.dest_id=d.id
    ORDER BY p.created_at DESC
  `);
  res.json(r.rows);
});

router.get('/:id', async (req, res) => {
  const r = await pool.query('SELECT * FROM packages WHERE id=$1', [req.params.id]);
  if (!r.rows.length) return res.status(404).json({ message: 'Not found' });
  res.json(r.rows[0]);
});

router.post('/', authenticate, adminOnly, async (req, res) => {
  const { dest_id, title, price, image_url, includes } = req.body;
  const r = await pool.query(
    'INSERT INTO packages(dest_id,title,price,image_url,includes) VALUES($1,$2,$3,$4,$5) RETURNING *',
    [dest_id, title, price, image_url, includes]
  );
  res.status(201).json(r.rows[0]);
});

router.put('/:id', authenticate, adminOnly, async (req, res) => {
  const { dest_id, title, price, image_url, includes } = req.body;
  const r = await pool.query(
    'UPDATE packages SET dest_id=$1,title=$2,price=$3,image_url=$4,includes=$5 WHERE id=$6 RETURNING *',
    [dest_id, title, price, image_url, includes, req.params.id]
  );
  res.json(r.rows[0]);
});

router.delete('/:id', authenticate, adminOnly, async (req, res) => {
  await pool.query('DELETE FROM packages WHERE id=$1', [req.params.id]);
  res.json({ message: 'Deleted' });
});

module.exports = router;

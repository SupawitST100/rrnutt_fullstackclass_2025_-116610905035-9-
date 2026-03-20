const router = require('express').Router();
const pool = require('../db');
const { authenticate, adminOnly } = require('../middleware/auth');

router.get('/', async (req, res) => {
  const r = await pool.query('SELECT * FROM destinations ORDER BY created_at DESC');
  res.json(r.rows);
});

router.get('/:id', async (req, res) => {
  const r = await pool.query('SELECT * FROM destinations WHERE id=$1', [req.params.id]);
  if (!r.rows.length) return res.status(404).json({ message: 'Not found' });
  res.json(r.rows[0]);
});

router.post('/', authenticate, adminOnly, async (req, res) => {
  const { name, location, description, image_url } = req.body;
  const r = await pool.query(
    'INSERT INTO destinations(name,location,description,image_url) VALUES($1,$2,$3,$4) RETURNING *',
    [name, location, description, image_url]
  );
  res.status(201).json(r.rows[0]);
});

router.put('/:id', authenticate, adminOnly, async (req, res) => {
  const { name, location, description, image_url } = req.body;
  const r = await pool.query(
    'UPDATE destinations SET name=$1,location=$2,description=$3,image_url=$4 WHERE id=$5 RETURNING *',
    [name, location, description, image_url, req.params.id]
  );
  res.json(r.rows[0]);
});

router.delete('/:id', authenticate, adminOnly, async (req, res) => {
  await pool.query('DELETE FROM destinations WHERE id=$1', [req.params.id]);
  res.json({ message: 'Deleted' });
});

module.exports = router;

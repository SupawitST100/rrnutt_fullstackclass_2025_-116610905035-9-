const router = require('express').Router();
const pool = require('../db');
const { authenticate, adminOnly } = require('../middleware/auth');

const COLS = 'id, name, location, price_per_night, image_url';

router.get('/', async (req, res) => {
  const r = await pool.query(`SELECT ${COLS} FROM hotels ORDER BY id DESC`);
  res.json(r.rows);
});

router.get('/:id', async (req, res) => {
  const r = await pool.query(`SELECT ${COLS} FROM hotels WHERE id=$1`, [req.params.id]);
  res.json(r.rows[0]);
});

router.post('/', authenticate, adminOnly, async (req, res) => {
  const { name, location, price_per_night, image_url } = req.body;
  const r = await pool.query(
    `INSERT INTO hotels(name,location,price_per_night,image_url) VALUES($1,$2,$3,$4) RETURNING ${COLS}`,
    [name, location, price_per_night, image_url]
  );
  res.status(201).json(r.rows[0]);
});

router.put('/:id', authenticate, adminOnly, async (req, res) => {
  const { name, location, price_per_night, image_url } = req.body;
  const r = await pool.query(
    `UPDATE hotels SET name=$1,location=$2,price_per_night=$3,image_url=$4 WHERE id=$5 RETURNING ${COLS}`,
    [name, location, price_per_night, image_url, req.params.id]
  );
  res.json(r.rows[0]);
});

router.delete('/:id', authenticate, adminOnly, async (req, res) => {
  await pool.query('DELETE FROM hotels WHERE id=$1', [req.params.id]);
  res.json({ message: 'Deleted' });
});

module.exports = router;
const router = require('express').Router();
const pool = require('../db');
const { authenticate, adminOnly } = require('../middleware/auth');

router.get('/', async (req, res) => {
  const r = await pool.query('SELECT * FROM flights ORDER BY id DESC');
  res.json(r.rows);
});
router.get('/:id', async (req, res) => {
  const r = await pool.query('SELECT * FROM flights WHERE id=$1', [req.params.id]);
  res.json(r.rows[0]);
});
router.post('/', authenticate, adminOnly, async (req, res) => {
  const { airline, flight_no, departure_loc, arrival_loc, time_schedule, price } = req.body;
  const r = await pool.query(
    'INSERT INTO flights(airline,flight_no,departure_loc,arrival_loc,time_schedule,price) VALUES($1,$2,$3,$4,$5,$6) RETURNING *',
    [airline, flight_no, departure_loc, arrival_loc, time_schedule, price]
  );
  res.status(201).json(r.rows[0]);
});
router.put('/:id', authenticate, adminOnly, async (req, res) => {
  const { airline, flight_no, departure_loc, arrival_loc, time_schedule, price } = req.body;
  const r = await pool.query(
    'UPDATE flights SET airline=$1,flight_no=$2,departure_loc=$3,arrival_loc=$4,time_schedule=$5,price=$6 WHERE id=$7 RETURNING *',
    [airline, flight_no, departure_loc, arrival_loc, time_schedule, price, req.params.id]
  );
  res.json(r.rows[0]);
});
router.delete('/:id', authenticate, adminOnly, async (req, res) => {
  await pool.query('DELETE FROM flights WHERE id=$1', [req.params.id]);
  res.json({ message: 'Deleted' });
});
module.exports = router;
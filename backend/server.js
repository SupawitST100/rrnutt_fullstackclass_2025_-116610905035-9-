require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());

// Routes
app.use('/api/auth',         require('./routes/auth'));
app.use('/api/destinations', require('./routes/destinations'));
app.use('/api/packages',     require('./routes/packages'));
app.use('/api/flights',      require('./routes/flights'));
app.use('/api/hotels',       require('./routes/hotels'));
app.use('/api/bookings',     require('./routes/bookings'));
app.use('/api/payments',     require('./routes/payments'));
app.use('/api/reviews',      require('./routes/reviews'));
app.use('/api/customers',    require('./routes/customers'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Backend running on http://localhost:${PORT}`));

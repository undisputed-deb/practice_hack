require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const visitRoutes = require('./routes/visits');
const clientRoutes = require('./routes/clients');
const alertRoutes = require('./routes/alerts');
const noteRoutes = require('./routes/notes');
const errorHandler = require('./middleware/errorHandler');
const { startAlertCron } = require('./cron/alertCron');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ success: true, data: { status: 'ok' }, error: null });
});

app.use('/api/auth', authRoutes);
app.use('/api/visits', visitRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/notes', noteRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startAlertCron();
});

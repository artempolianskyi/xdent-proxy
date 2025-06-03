const express = require('express');
const fetch = require('node-fetch');
const app = express();
app.use(express.json());

const SHEET_API_BASE = 'https://script.google.com/macros/s/109520957560384863731/exec';

app.get('/bonus', async (req, res) => {
  const rc = req.query.rc;
  if (!rc) return res.status(400).json({ error: 'Missing rc' });

  try {
    const apiRes = await fetch(`${SHEET_API_BASE}?rc=${encodeURIComponent(rc)}`);
    const data = await apiRes.json();
    res.set('Access-Control-Allow-Origin', '*'); // 👈 вирішення CORS
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Google API error', details: err.message });
  }
});

app.post('/bonus', async (req, res) => {
  const { rc, bonus_points } = req.body;
  if (!rc || bonus_points == null) return res.status(400).json({ error: 'Missing rc or bonus_points' });

  // Тут можна реалізувати логіку для редагування бонусів через Apps Script (потрібен окремий endpoint у script)
  // Наприклад: POST до Google Script з rc і бонусами

  res.json({ status: 'Success (mock)', rc, bonus_points });
});

app.listen(3000, () => console.log('🚀 Proxy running on port 3000'));

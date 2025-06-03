const express = require('express');
const fetch = require('node-fetch');
const app = express();

const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwzCvRsbx1A2LCslwzsD85ZcmScCwAym7rtwwfcg0tPIK04shQxPKkyePext-VH4vAyBw/exec';

app.get('/bonus', async (req, res) => {
  const rc = req.query.rc;
  if (!rc) {
    return res.status(400).json({ error: 'Missing rc parameter' });
  }

  const url = `${GOOGLE_APPS_SCRIPT_URL}?rc=${encodeURIComponent(rc)}`;

  try {
    const response = await fetch(url);
    const text = await response.text();

    // Спробуємо розпарсити JSON
    try {
      const json = JSON.parse(text);
      res.set('Access-Control-Allow-Origin', '*');
      res.set('Access-Control-Allow-Methods', 'GET');
      res.set('Access-Control-Allow-Headers', 'Content-Type');
      return res.json(json);
    } catch (parseError) {
      // Якщо відповідь не JSON (наприклад, HTML з помилкою)
      console.warn('⚠️ Відповідь не JSON. Частина відповіді:', text.slice(0, 200));
      return res.status(502).json({
        error: 'Invalid response from Google Apps Script',
        details: parseError.message,
        preview: text.slice(0, 200) // на всяк випадок покажемо частину HTML
      });
    }

  } catch (err) {
    console.error('❌ Помилка при запиті до GAS:', err);
    return res.status(500).json({ error: 'Proxy fetch error', details: err.message });
  }
});

app.listen(3000, () => {
  console.log('🚀 Proxy running at http://localhost:3000');
});

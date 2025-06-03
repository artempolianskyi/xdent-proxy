const express = require('express');
const fetch = require('node-fetch');
const app = express();

const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwzCvRsbx1A2LCslwzsD85ZcmScCwAym7rtwwfcg0tPIK04shQxPKkyePext-VH4vAyBw/exec';

app.get('/bonus', async (req, res) => {
  const rc = req.query.rc;
  if (!rc) {
    return res.status(400).json({ error: 'Missing rc' });
  }

  try {
    const url = `${GOOGLE_APPS_SCRIPT_URL}?rc=${encodeURIComponent(rc)}`;
    const response = await fetch(url);
    const data = await response.text(); // іноді Google відповідає як text
    const json = JSON.parse(data);

    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.json(json);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Proxy error', details: err.message });
  }
});

app.listen(3000, () => {
  console.log('🚀 Proxy running on http://localhost:3000');
});

const express = require('express')
const authMiddleware = require('../middlewares/auth.middleware')
const router = express.Router()


router.post('/login', authMiddleware, async (req, res) => {
  try {
    console.log('galdik');
    
    const response = await fetch('http://172.20.169.105:8080/A1Kafe_war/login.do?mode=add_web_user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body),
      redirect: 'manual' // ⚠️ Juda muhim: fetch redirectni avtomatik qilmasin
    });

    // Java backenddan kelgan redirect URL
    const redirectUrl = response.headers.get('location');

    if (redirectUrl) {
      return res.json({ redirect: 'http://172.20.169.105:8080/A1Kafe_war/' + redirectUrl }); // frontendga redirect manzilini qaytaramiz
    }

    const result = await response.text();
    res.send(result);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router

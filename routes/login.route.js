const express = require('express')
const authMiddleware = require('../middlewares/auth.middleware')
const router = express.Router()


router.post('/login', authMiddleware, async (req, res) => {
  try {
    console.log('galdik');

    console.log(req.body);
    
    const response = await fetch('http://90.156.199.148:8082/kafe/login.do?mode=add_web_user', {
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
      return res.json({ redirect: 'http://90.156.199.148:8082/kafe/' + redirectUrl }); // frontendga redirect manzilini qaytaramiz
    }

    const result = await response.text();
    res.send(result);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router

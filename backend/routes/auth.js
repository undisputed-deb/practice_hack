const express = require('express');
const supabase = require('../supabaseClient');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, data: null, error: 'email and password required' });
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return res.status(401).json({ success: false, data: null, error: error.message });
    }

    res.json({ success: true, data, error: null });
  } catch (err) {
    next(err);
  }
});

router.post('/logout', authMiddleware, async (req, res, next) => {
  try {
    const { error } = await supabase.auth.admin.signOut(req.headers.authorization.slice('Bearer '.length));
    if (error) {
      return res.status(400).json({ success: false, data: null, error: error.message });
    }
    res.json({ success: true, data: null, error: null });
  } catch (err) {
    next(err);
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  res.json({ success: true, data: req.user, error: null });
});

module.exports = router;

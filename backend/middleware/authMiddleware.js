const supabase = require('../supabaseClient');

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, data: null, error: 'Missing bearer token' });
  }

  const token = authHeader.slice('Bearer '.length);
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data?.user) {
    return res.status(401).json({ success: false, data: null, error: 'Invalid or expired token' });
  }

  req.user = data.user;
  next();
}

module.exports = authMiddleware;

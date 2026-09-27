const express = require('express');
const supabase = require('../supabaseClient');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { client_id, staff_id, note } = req.body;
    if (!client_id || !staff_id || !note) {
      return res.status(400).json({ success: false, data: null, error: 'client_id, staff_id, note required' });
    }

    const { data, error } = await supabase
      .from('case_notes')
      .insert({ client_id, staff_id, note })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, data, error: null });
  } catch (err) {
    next(err);
  }
});

router.get('/:client_id', async (req, res, next) => {
  try {
    const { client_id } = req.params;
    const { data, error } = await supabase
      .from('case_notes')
      .select('*, staff:staff_id(name)')
      .eq('client_id', client_id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, data, error: null });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

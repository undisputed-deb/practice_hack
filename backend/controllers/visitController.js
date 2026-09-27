const supabase = require('../supabaseClient');

async function checkin(req, res, next) {
  try {
    const { client_id, staff_id } = req.body;
    if (!client_id || !staff_id) {
      return res.status(400).json({ success: false, data: null, error: 'client_id and staff_id required' });
    }

    const { data: existing, error: existingError } = await supabase
      .from('visits')
      .select('id')
      .eq('staff_id', staff_id)
      .is('checkout_time', null)
      .limit(1);

    if (existingError) throw existingError;
    if (existing.length > 0) {
      return res.status(409).json({ success: false, data: null, error: 'Staff already has an active visit' });
    }

    const { data, error } = await supabase
      .from('visits')
      .insert({ client_id, staff_id, checkin_time: new Date().toISOString(), status: 'active' })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, data, error: null });
  } catch (err) {
    next(err);
  }
}

async function checkout(req, res, next) {
  try {
    const { visit_id } = req.body;
    if (!visit_id) {
      return res.status(400).json({ success: false, data: null, error: 'visit_id required' });
    }

    const { data: visit, error: fetchError } = await supabase
      .from('visits')
      .select('id, checkout_time')
      .eq('id', visit_id)
      .single();

    if (fetchError) throw fetchError;
    if (visit.checkout_time) {
      return res.status(409).json({ success: false, data: null, error: 'Visit already checked out' });
    }

    const { data, error } = await supabase
      .from('visits')
      .update({ checkout_time: new Date().toISOString(), status: 'completed' })
      .eq('id', visit_id)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, data, error: null });
  } catch (err) {
    next(err);
  }
}

async function getActiveVisits(req, res, next) {
  try {
    const { data, error } = await supabase
      .from('visits')
      .select('*, staff:staff_id(name), client:client_id(name)')
      .is('checkout_time', null);

    if (error) throw error;
    res.json({ success: true, data, error: null });
  } catch (err) {
    next(err);
  }
}

async function getStaffHistory(req, res, next) {
  try {
    const { staff_id } = req.params;
    const { data, error } = await supabase
      .from('visits')
      .select('*, client:client_id(name)')
      .eq('staff_id', staff_id)
      .not('checkout_time', 'is', null)
      .order('checkin_time', { ascending: false });

    if (error) throw error;
    res.json({ success: true, data, error: null });
  } catch (err) {
    next(err);
  }
}

module.exports = { checkin, checkout, getActiveVisits, getStaffHistory };

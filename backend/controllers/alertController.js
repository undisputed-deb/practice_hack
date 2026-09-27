const supabase = require('../supabaseClient');

async function getActiveAlerts(req, res, next) {
  try {
    const { data, error } = await supabase
      .from('alerts')
      .select('*, staff:staff_id(name), visit:visit_id(client_id, checkin_time)')
      .eq('resolved', false)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, data, error: null });
  } catch (err) {
    next(err);
  }
}

async function resolveAlert(req, res, next) {
  try {
    const { alert_id } = req.params;
    const { data, error } = await supabase
      .from('alerts')
      .update({ resolved: true })
      .eq('id', alert_id)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, data, error: null });
  } catch (err) {
    next(err);
  }
}

module.exports = { getActiveAlerts, resolveAlert };

const supabase = require('../supabaseClient');

async function getClients(req, res, next) {
  try {
    const { data, error } = await supabase.from('clients').select('*');
    if (error) throw error;
    res.json({ success: true, data, error: null });
  } catch (err) {
    next(err);
  }
}

async function getClientById(req, res, next) {
  try {
    const { id } = req.params;

    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();

    if (clientError) throw clientError;

    const { data: visits, error: visitsError } = await supabase
      .from('visits')
      .select('*, staff:staff_id(name)')
      .eq('client_id', id)
      .order('checkin_time', { ascending: false });

    if (visitsError) throw visitsError;

    res.json({ success: true, data: { ...client, visits }, error: null });
  } catch (err) {
    next(err);
  }
}

async function createClient(req, res, next) {
  try {
    const { name, age, address, diagnosis_category, assigned_staff_id, status } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, data: null, error: 'name required' });
    }

    const { data, error } = await supabase
      .from('clients')
      .insert({ name, age, address, diagnosis_category, assigned_staff_id, status: status || 'active' })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, data, error: null });
  } catch (err) {
    next(err);
  }
}

module.exports = { getClients, getClientById, createClient };

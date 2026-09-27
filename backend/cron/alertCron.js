const cron = require('node-cron');
const supabase = require('../supabaseClient');

const ALERT_THRESHOLD_MINUTES = 90;

async function checkOverdueVisits() {
  const thresholdTime = new Date(Date.now() - ALERT_THRESHOLD_MINUTES * 60 * 1000).toISOString();

  const { data: overdueVisits, error } = await supabase
    .from('visits')
    .select('id, staff_id, checkin_time')
    .is('checkout_time', null)
    .eq('status', 'active')
    .lt('checkin_time', thresholdTime);

  if (error) {
    console.error('Alert cron: failed to fetch overdue visits', error.message);
    return;
  }

  for (const visit of overdueVisits) {
    const { error: alertError } = await supabase.from('alerts').insert({
      visit_id: visit.id,
      staff_id: visit.staff_id,
      alert_type: 'no_checkout',
      message: `No checkout after ${ALERT_THRESHOLD_MINUTES} minutes since check-in`,
    });

    if (alertError) {
      console.error(`Alert cron: failed to create alert for visit ${visit.id}`, alertError.message);
      continue;
    }

    const { error: updateError } = await supabase
      .from('visits')
      .update({ status: 'alert' })
      .eq('id', visit.id);

    if (updateError) {
      console.error(`Alert cron: failed to update visit ${visit.id} status`, updateError.message);
    }
  }
}

function startAlertCron() {
  cron.schedule('*/5 * * * *', checkOverdueVisits);
  console.log('Safety alert cron scheduled (every 5 minutes)');
}

module.exports = { startAlertCron, checkOverdueVisits };

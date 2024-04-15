const handleFormChange = async (data) => {
  const { pool } = require('../app');
  const { rows: submitterRows } = await pool.query('SELECT * FROM submitters WHERE external_id = $1', [data.id]);
  const submitter = submitterRows[0];

  if (submitter) {
    await pool.query('UPDATE submitters SET opened_at = $1, completed_at = $2, status = $3 WHERE external_id = $4', [data.opened_at, data.completed_at, data.status, data.id]);
  }
}

exports.post = (req, res) => {
  const body = req.body;

  if (['form.viewed', 'form.started', 'form.completed'].includes(body.event_type) && body.data) {
    handleFormChange(body.data);
  }

  res.status(200)
};

exports.sign = async (req, res) => {
  const { pool } = require('../app');
  const { id: submitterId } = req.params;
  const { rows: submitterRows } = await pool.query('SELECT * FROM submitters WHERE id = $1', [submitterId]);

  if (submitterRows.length === 0) {
    return res.status(404).json({ error: 'Submitter not found' });
  }

  res.json({ submitter: submitterRows[0] });
}

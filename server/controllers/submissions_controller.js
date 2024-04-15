exports.index = async (req, res) => {
  const { pool } = require('../app');
  const { rows: submissionRows } = await pool.query('SELECT * FROM submissions');

  if (submissionRows.length === 0) return res.json({ submissions: [] });

  const { rows: submitterRows } = await pool.query('SELECT * FROM submitters WHERE submission_id IN ($1)', [submissionRows.map((submission) => submission.id).join(',')]);
  const { rows: templateRows } = await pool.query('SELECT * FROM templates WHERE id IN ($1)', [submissionRows.map((submission) => submission.template_id).join(',')]);

  res.json({
    submissions: submissionRows.map((submission) => {
      return {
        id: submission.id,
        template: templateRows.find((template) => template.id === submission.template_id),
        submitters: submitterRows.filter((submitter) => submitter.submission_id === submission.id)
      }
    })
  });
};

exports.show = async (req, res) => {
  const { pool } = require('../app');
  const { id: submissionId } = req.params;
  const { rows: submissionRows } = await pool.query('SELECT * FROM submissions WHERE id = $1', [submissionId]);

  if (submissionRows.length === 0) {
    return res.status(404).json({ error: 'Submission not found' });
  }

  const templateId = submissionRows[0].template_id;

  const { rows: templateRows } = await pool.query('SELECT * FROM templates WHERE id = $1', [templateId]);

  const jwt = require('jsonwebtoken');
  const token = jwt.sign({
    user_email: process.env.DOCUSEAL_USER_EMAIL,
    template_id: templateRows[0].external_id,
  }, process.env.DOCUSEAL_API_KEY)

  res.json({ token });
}

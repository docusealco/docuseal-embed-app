
exports.new = async (req, res) => {
  const jwt = require('jsonwebtoken');
  const token = jwt.sign({
    user_email: process.env.DOCUSEAL_USER_EMAIL
  }, process.env.DOCUSEAL_API_KEY)

  res.json({ token });
};

exports.update = async (req, res) => {
  const fetch = require('node-fetch-commonjs');
  const { pool } = require('../app');
  const { template_id: externalId } = req.body;

  fetch(`${process.env.DOCUSEAL_API_URL}/templates/${externalId}`, {
    headers: {
      'Content-Type': 'application/json',
      'X-Auth-Token': process.env.DOCUSEAL_API_KEY,
    }
  }).then((response) => response.json())
    .then(async (data) => {
      await pool.query('INSERT INTO templates (external_id, name, slug) VALUES ($1, $2, $3) ON CONFLICT (external_id) DO UPDATE SET name = $2, slug = $3', [data.id, data.name, data.slug]);
      return res.status(200)
    }).catch((error) => {
      console.error('Error:', error);
      return res.status(500).json({ error: error });
    })
}

exports.index = async (req, res) => {
  const { pool } = require('../app');
  const { rows } = await pool.query('SELECT * FROM templates');

  res.json({ templates: rows });
}

exports.show = async (req, res) => {
  const { pool } = require('../app');
  const { id: templateId } = req.params;
  const { rows: templateRows } = await pool.query('SELECT * FROM templates WHERE id = $1', [templateId]);

  if (templateRows.length === 0) {
    return res.status(404).json({ error: 'Template not found' });
  }

  // Fetch submissions
  fetch(`${process.env.DOCUSEAL_API_URL}/submissions/?template_id=${templateRows[0].external_id}&limit=100`, {
    headers: {
      'Content-Type': 'application/json',
      'X-Auth-Token': process.env.DOCUSEAL_API_KEY,
    }
  }).then((response) => response.json())
    .then(async (responseData) => {
      responseData.data.forEach(async (submission) => {
        const { rows: submissionRows } = await pool.query('SELECT * FROM submissions WHERE external_id = $1', [submission.id]);
        let submissionId = submissionRows[0]?.id

        if (submissionRows.length === 0) {
          submissionId = await pool.query('INSERT INTO submissions (template_id, external_id) VALUES ($1, $2) RETURNING id', [templateId, submission.id]);
        }

        submission.submitters.forEach(async (submitter) => {
          const { rows: submitterRows } = await pool.query('SELECT * FROM submitters WHERE uuid = $1', [submitter.uuid]);

          if (submitterRows.length === 0) {
            await pool.query('INSERT INTO submitters (submission_id, external_id, uuid, email, slug, sent_at, opened_at, completed_at, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [submissionId, submitter.id.toString(), submitter.uuid, submitter.email, submitter.slug, submitter.sent_at, submitter.opened_at, submitter.completed_at, submitter.status]);
          }
        });
      });
    }).catch((error) => {
      console.error('Error:', error);
    })

  const { rows: submissionRows } = await pool.query('SELECT * FROM submissions WHERE template_id = $1', [templateId]);

  if (submissionRows.length === 0) return res.json({ template: templateRows[0] || {}, submissions: [] });

  const { rows: submitterRows } = await pool.query('SELECT * FROM submitters WHERE submission_id IN ($1)', [submissionRows.map((submission) => submission.id).join(',')]);

  res.json({
    template: templateRows[0],
    submissions: submissionRows.map((submission) => {
      return {
        id: submission.id,
        submitters: submitterRows.filter((submitter) => submitter.submission_id === submission.id)
      }
    })
  });
}


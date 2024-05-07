const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const fetch = require('node-fetch-commonjs');
const { Pool } = require('pg');

dotenv.config();

const app = express();

// Database connection
const db = new Pool({ connectionString: process.env.DATABASE_URL })

// Database initialization
try {
  db.query(fs.readFileSync('db.sql', { encoding: 'utf8' }));
} catch (err) {
  console.error('Error creating table:', err);
}

// Middleware
app.use(logger('dev'));
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// React app
if (process.env.NODE_ENV === "production") {
  app.get('*', (req, res) => { res.sendFile(path.join(__dirname, 'public', 'index.html')) });
}

// Synhronize submissions
const loadSubmission = async (templateId, externalSubmissionId) => {
  return fetch(`${process.env.DOCUSEAL_API_URL}/submissions/${externalSubmissionId}`, {
    headers: {
      'Content-Type': 'application/json',
      'X-Auth-Token': process.env.DOCUSEAL_API_KEY,
    }
  }).then((response) => response.json())
    .then(async (submission) => {
      const { rows: submissionRows } = await db.query('SELECT * FROM submissions WHERE external_id = $1', [submission.id]);
      let submissionId = submissionRows[0]?.id

      if (submissionRows.length === 0) {
        const { rows: submissionRows } = await db.query('INSERT INTO submissions (template_id, external_id) VALUES ($1, $2) RETURNING id', [templateId, submission.id])

        submissionId = submissionRows[0]?.id
      }

      submission.submitters.forEach(async (submitter) => {
        const { rows: submitterRows } = await db.query('SELECT * FROM submitters WHERE external_id = $1', [submitter.id]);

        if (submitterRows.length === 0) {
          await db.query('INSERT INTO submitters (submission_id, external_id, uuid, email, slug, sent_at, opened_at, completed_at, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT (external_id) DO UPDATE SET sent_at = $6, opened_at = $7, completed_at = $8, status = $9', [submissionId, submitter.id.toString(), submitter.uuid, submitter.email, submitter.slug, submitter.sent_at, submitter.opened_at, submitter.completed_at, submitter.status]);
        }
      });
    }).catch((error) => {
      console.error('Error:', error);
    })
}

const loadSubmissions = async (templateId, externalTemplateId) => {
  return await fetch(`${process.env.DOCUSEAL_API_URL}/submissions/?template_id=${externalTemplateId}&limit=100`, {
    headers: {
      'Content-Type': 'application/json',
      'X-Auth-Token': process.env.DOCUSEAL_API_KEY,
    }
  }).then((response) => response.json())
    .then(async (responseData) => {
      responseData.data.forEach(async (submission) => {
        const { rows: submissionRows } = await db.query('SELECT * FROM submissions WHERE external_id = $1', [submission.id]);
        let submissionId = submissionRows[0]?.id

        if (submissionRows.length === 0) {
          const { rows: submissionRows } = await db.query('INSERT INTO submissions (template_id, external_id) VALUES ($1, $2) RETURNING id', [templateId, submission.id])

          submissionId = submissionRows[0]?.id
        }

        submission.submitters.forEach(async (submitter) => {
          const { rows: submitterRows } = await db.query('SELECT * FROM submitters WHERE uuid = $1', [submitter.uuid]);

          if (submitterRows.length === 0) {
            await db.query('INSERT INTO submitters (submission_id, external_id, uuid, email, slug, sent_at, opened_at, completed_at, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [submissionId, submitter.id.toString(), submitter.uuid, submitter.email, submitter.slug, submitter.sent_at, submitter.opened_at, submitter.completed_at, submitter.status]);
          }
        });
      });
    }).catch((error) => {
      console.error('Error:', error);
    })
}

// Routes
// ====================
// Submissions endpoints
app.get('/api/submissions', async (req, res) => {
  const { rows: submissionRows } = await db.query('SELECT * FROM submissions ORDER BY id DESC');

  if (submissionRows.length === 0) return res.json({ submissions: [] });

  const { rows: submitterRows } = await db.query('SELECT * FROM submitters WHERE submission_id = ANY($1) ORDER BY id DESC', [submissionRows.map((submission) => submission.id)]);
  const { rows: templateRows } = await db.query('SELECT * FROM templates WHERE id = ANY($1)', [submissionRows.map((submission) => submission.template_id)]);

  res.json({
    submissions: submissionRows.map((submission) => {
      return {
        id: submission.id,
        template: templateRows.find((template) => template.id === submission.template_id),
        submitters: submitterRows.filter((submitter) => submitter.submission_id === submission.id)
      }
    })
  });
})

app.get('/api/submissions/:id', async (req, res) => {
  const { id: submissionId } = req.params;
  const { rows: submissionRows } = await db.query('SELECT * FROM submissions WHERE id = $1', [submissionId]);

  if (submissionRows.length === 0) {
    return res.status(404).json({ error: 'Submission not found' });
  }

  const templateId = submissionRows[0].template_id;

  const { rows: templateRows } = await db.query('SELECT * FROM templates WHERE id = $1', [templateId]);

  const jwt = require('jsonwebtoken');
  const token = jwt.sign({
    user_email: process.env.DOCUSEAL_USER_EMAIL,
    template_id: templateRows[0].external_id,
  }, process.env.DOCUSEAL_API_KEY)

  res.json({ token });
})

app.get('/api/templates/:template_id/submissions/new', async (req, res) => {
  const { template_id: templateId } = req.params;
  const { rows: templateRows } = await db.query('SELECT * FROM templates WHERE id = $1', [templateId]);

  if (templateRows.length === 0) {
    return res.status(404).json({ error: 'Template not found' });
  }

  res.json({ template: templateRows[0] });
});

app.post('/api/templates/:template_id/submissions', async (req, res) => {
  const { template_id: templateId } = req.params;
  const { rows: templateRows } = await db.query('SELECT * FROM templates WHERE id = $1', [templateId]);

  if (templateRows.length === 0) {
    return res.status(404).json({ error: 'Template not found' });
  }

  const body = req.body;
  const data = {
    template_id: templateRows[0].external_id,
    send_email: body.submission.send_email,
    submitters: body.submission.submitters
  }

  if (body.message) {
    data.message = body.message;
  }

  fetch(`${process.env.DOCUSEAL_API_URL}/submissions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Auth-Token': process.env.DOCUSEAL_API_KEY,
    },
    body: JSON.stringify(data)
  }).then((response) => response.json())
    .then(async (submitters) => {
      await loadSubmission(templateId, submitters[0].submission_id)

      res.status(200).json({ message: 'Submission created' });
    }).catch((error) => {
      res.status(500).json({ error: error });
    })
})

// Template endpoints
app.get('/api/templates/new', (req, res) => {
  const jwt = require('jsonwebtoken');
  const token = jwt.sign({
    user_email: process.env.DOCUSEAL_USER_EMAIL
  }, process.env.DOCUSEAL_API_KEY)

  res.json({ token });
});

app.get('/api/templates', async (req, res) => {
  const { rows } = await db.query('SELECT * FROM templates ORDER BY id DESC');

  res.json({ templates: rows });
});

app.get('/api/templates/:id', async (req, res) => {
  const { id: templateId } = req.params;
  const { rows: templateRows } = await db.query('SELECT * FROM templates WHERE id = $1', [templateId]);

  if (templateRows.length === 0) {
    return res.status(404).json({ error: 'Template not found' });
  }

  await loadSubmissions(templateId, templateRows[0].external_id)

  const { rows: submissionRows } = await db.query('SELECT * FROM submissions WHERE template_id = $1 ORDER BY id DESC ', [templateId]);

  if (submissionRows.length === 0) return res.json({ template: templateRows[0] || {}, submissions: [] });

  const { rows: submitterRows } = await db.query('SELECT * FROM submitters WHERE submission_id = ANY($1) ORDER BY id DESC', [submissionRows.map((submission) => submission.id)]);

  res.json({
    template: templateRows[0],
    submissions: submissionRows.map((submission) => {
      return {
        id: submission.id,
        submitters: submitterRows.filter((submitter) => submitter.submission_id === submission.id)
      }
    })
  });
});

app.post('/api/templates', (req, res) => {
  const { template_id: externalId } = req.body;

  fetch(`${process.env.DOCUSEAL_API_URL}/templates/${externalId}`, {
    headers: {
      'Content-Type': 'application/json',
      'X-Auth-Token': process.env.DOCUSEAL_API_KEY,
    }
  }).then((response) => response.json())
    .then(async (data) => {
      const { rows: templateRows } = await db.query('INSERT INTO templates (external_id, name, slug, preview_image_url, submitters) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (external_id) DO UPDATE SET name = $2, slug = $3, preview_image_url = $4, submitters = $5 RETURNING *', [data.id, data.name, data.slug, data.documents[0]?.preview_image_url, data.submitters.map(JSON.stringify)]);

      return res.json({ template: templateRows[0] });
    }).catch((error) => {
      console.error('Error:', error);
      return res.status(500).json({ error: error });
    })
})

// Submitters endpoints
app.get('/api/sign/:id', async (req, res) => {
  const { id: submitterId } = req.params;
  const { rows: submitterRows } = await db.query('SELECT * FROM submitters WHERE id = $1', [submitterId]);

  if (submitterRows.length === 0) {
    return res.status(404).json({ error: 'Submitter not found' });
  }

  res.json({ submitter: submitterRows[0] });
});

// Webhooks endpoints
app.post('/webhooks', async (req, res) => {
  const body = req.body;
  const { event_type, data } = body;

  if (['form.viewed', 'form.started', 'form.completed'].includes(event_type) && data) {
    const { rows: submitterRows } = await db.query('SELECT * FROM submitters WHERE external_id = $1', [data.id]);
    const submitter = submitterRows[0];

    if (submitter) {
      await db.query('UPDATE submitters SET opened_at = $1, completed_at = $2, status = $3 WHERE external_id = $4', [data.opened_at, data.completed_at, data.status, data.id]);
    }
  }

  res.status(200).json({ message: 'Webhook received' });
})

module.exports = app;


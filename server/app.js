const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const { Pool } = require('pg');

var app = express();
var corsOptions = cors({ origin: 'http://localhost:3000' });

app.use(logger('dev'));
app.use(corsOptions);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

dotenv.config();

// Controllers
const submissionsController = require('./controllers/submissions_controller');
const submittersController = require('./controllers/submitters_controller');
const templatesController = require('./controllers/templates_controller');
const webhooksController = require('./controllers/webhooks_controller');
// Routes
app.get('/api/submissions', submissionsController.index);
app.get('/api/templates/new', templatesController.new);
app.get('/api/templates', templatesController.index);
app.get('/api/templates/:id', templatesController.show);
app.get('/api/sign/:id', submittersController.sign);
app.get('/api/submissions/:id', submissionsController.show);
app.post('/api/templates', templatesController.update);
app.post('/webhooks', webhooksController.post);

if (process.env.NODE_ENV === "production") {
  app.get('*', (req, res) => { res.sendFile(path.join(__dirname, 'public', 'index.html')) });
}

// Database connection
const pool = new Pool({ connectionString: process.env.DATABASE_URL })


// Database initialization
try {
  const sqlQuery = `
    CREATE TABLE IF NOT EXISTS templates (
      id SERIAL PRIMARY KEY,
      external_id VARCHAR(100),
      name VARCHAR(100),
      slug VARCHAR(100)
    );

    CREATE TABLE IF NOT EXISTS submissions (
      id SERIAL PRIMARY KEY,
      template_id INTEGER REFERENCES templates(id),
      external_id VARCHAR(100)
    );

    CREATE TABLE IF NOT EXISTS submitters (
      id SERIAL PRIMARY KEY,
      submission_id INTEGER REFERENCES submissions(id),
      external_id VARCHAR(100),
      uuid VARCHAR(100),
      email VARCHAR(100),
      slug VARCHAR(100),
      sent_at TIMESTAMP,
      opened_at TIMESTAMP,
      completed_at TIMESTAMP,
      status VARCHAR(100)
    );

    CREATE UNIQUE INDEX IF NOT EXISTS templates_external_id_idx ON templates(external_id);
    CREATE UNIQUE INDEX IF NOT EXISTS submissions_external_id_idx ON submissions(external_id);
    CREATE UNIQUE INDEX IF NOT EXISTS submitters_uuid_idx ON submitters(uuid);
  `;

  pool.query(sqlQuery);
} catch (err) {
  console.error('Error creating table:', err);
}

module.exports = { app, pool };


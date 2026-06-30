// server.js
// Single Express server that serves the static portfolio site AND
// handles the contact form submission via /api/send.
// This is the entry point Render will run (npm start).

const path = require('path');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

let nodemailer;
try {
  nodemailer = require('nodemailer');
} catch (e) {
  nodemailer = null;
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve all static files (index.html, style.css, main.js, Images/, PDF, etc.)
app.use(express.static(path.join(__dirname)));

const EMAIL_TO = process.env.EMAIL_TO || 'qtemmytope@gmail.com';

function getTransporter() {
  if (!nodemailer) return null;

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const secure = process.env.SMTP_SECURE === 'true';
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port: port || 587,
    secure: Boolean(secure),
    auth: { user, pass },
  });
}

app.post('/api/send', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body || {};
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const transporter = getTransporter();
    if (!transporter) {
      console.error('SMTP not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS env vars.');
      return res.status(500).json({ success: false, error: 'Email is not configured on the server yet.' });
    }

    const mailOptions = {
      from: `"${name}" <${process.env.SMTP_USER}>`,
      replyTo: email,
      to: EMAIL_TO,
      subject: subject && subject.length ? `${subject} — Portfolio Contact` : 'Portfolio Contact Message',
      text: `You have a new message from your portfolio site:\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject || '-'}\n\nMessage:\n${message}`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    return res.json({ success: true });
  } catch (err) {
    console.error('Error sending email', err);
    return res.status(500).json({ success: false, error: 'Something went wrong sending your message.' });
  }
});

app.get('/health', (req, res) => res.json({ ok: true }));

// Fallback to index.html for any other GET route (simple SPA-friendly catch-all)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => console.log(`Portfolio server listening on port ${PORT}`));

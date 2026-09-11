const express = require('express');
const path = require('path');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'theo.rslllhck@trs4.com';
const mailer = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    })
  : null;
const accounts = new Map();

function requiredFields(body, fields) {
  return fields.every((field) => typeof body[field] === 'string' && body[field].trim());
}

async function sendMessage({ replyTo, subject, text }) {
  if (!mailer) return false;
  await mailer.sendMail({ from: process.env.SMTP_FROM || CONTACT_EMAIL, to: CONTACT_EMAIL, replyTo, subject, text });
  return true;
}

const siteData = {
  profile: {
    name: 'Niels',
    age: 16,
    alias: 'TRS4',
    focus: 'Cybersécurité, réseaux, Red Team',
    objective: 'Apprendre, créer, comprendre',
    description:
      'Je suis de la Red Team et j’essaie constamment de tester de nouvelles méthodes, de nouvelles approches, dans un cadre légal et sur des machines virtuelles.'
  },
  material: [
    {
      title: 'MacBook',
      description: 'Machine principale pour le développement, la création et le suivi du travail quotidien.',
      image: 'image/16fc42fc-tuf-dash-f15_png__1200_678__2-0-1873-1055.jpg.png'
    },
    {
      title: 'Asus + Kali Linux',
      description: 'Environnement technique pour l’analyse réseau, les outils de sécurité et les manipulations en sandbox.',
      image: 'image/16fc42fc-tuf-dash-f15_png__1200_678__2-0-1873-1055.jpg.png'
    },
    {
      title: 'Raspberry Pi',
      description: 'Plateforme compacte pour tester des configurations, des protocoles et des scénarios de réseau.',
      image: 'image/A300-PI-C_01.jpg'
    },
    {
      title: 'Switchs',
      description: 'Utilisés pour simuler des échanges, faire des tests de topologie et comprendre les flux de données.',
      image: 'image/f9148aec85284b15f2d324ada868650181dc6aeb.jpg'
    },
    {
      title: 'Mon cerveau',
      description: 'Le vrai moteur du projet : analyse, réflexion, logique et capacité à concevoir des solutions concrètes.',
      image: 'image/23807017.jpg-2.webp'
    }
  ],
  progression: [
    {
      month: 'Sept.',
      title: 'Initialisation',
      text: 'Je commence à explorer le monde du numérique et je cherche à comprendre les mécanismes des systèmes.'
    },
    {
      month: 'Oct.',
      title: 'Analyse',
      text: 'Je découvre la logique du web et je commence à lire les structures qui composent les pages et les outils numériques.'
    },
    {
      month: 'Nov.',
      title: 'Architecture',
      text: 'J’apprends à organiser l’information et à concevoir une expérience plus claire.'
    },
    {
      month: 'Janv.',
      title: 'Débogage',
      text: 'Les erreurs deviennent des outils d’apprentissage. Je teste, je corrige, je reprends et je trouve des solutions.'
    },
    {
      month: 'Févr.',
      title: 'Simulation',
      text: 'Je découvre l’intérêt de reproduire des environnements techniques pour mieux comprendre les flux et les échanges.'
    },
    {
      month: 'Mars',
      title: 'Projet',
      text: 'Je mets en pratique les concepts sur des scénarios fictifs de réseaux, d’analyse et de sécurité conceptuelle.'
    }
  ],
  projects: [
    {
      title: 'Mission',
      text: 'Infiltration d’un réseau fictif dans un environnement de test. Le scénario est entièrement imaginaire et utilisé uniquement à des fins de compréhension.'
    },
    {
      title: 'Approche',
      text: 'Identification des flux, observation des ports, test des accès, prise en compte des vulnérabilités logiques et compréhension du comportement du réseau.'
    },
    {
      title: 'Limite',
      text: 'Ce projet est strictement fictif : il ne vise ni à endommager, ni à exploiter un système réel, ni à contourner des protections qui ne lui appartiennent pas.'
    }
  ],
  meta: {
    credit: 'Credit by TRS4',
    status: 'live'
  }
};

app.use(express.json());

app.post('/api/contact', async (req, res) => {
  if (!requiredFields(req.body, ['name', 'email', 'message'])) {
    return res.status(400).json({ error: 'Nom, e-mail et message requis.' });
  }
  try {
    const sent = await sendMessage({
      replyTo: req.body.email,
      subject: `[TRS4 contact] ${req.body.name}`,
      text: `Nom : ${req.body.name}\nE-mail : ${req.body.email}\n\n${req.body.message}`
    });
    res.status(sent ? 200 : 503).json({ sent, message: sent ? 'Message envoyé.' : 'SMTP non configuré dans Render.' });
  } catch (error) {
    console.error('Contact mail failed:', error.message);
    res.status(502).json({ error: 'Impossible d’envoyer le message.' });
  }
});

app.post('/api/quote', async (req, res) => {
  if (!requiredFields(req.body, ['name', 'email', 'service', 'project'])) {
    return res.status(400).json({ error: 'Tous les champs du devis sont requis.' });
  }
  try {
    const sent = await sendMessage({
      replyTo: req.body.email,
      subject: `[TRS4 devis] ${req.body.service} - ${req.body.name}`,
      text: `Nom : ${req.body.name}\nE-mail : ${req.body.email}\nService : ${req.body.service}\n\nProjet :\n${req.body.project}`
    });
    res.status(sent ? 200 : 503).json({ sent, message: sent ? 'Demande de devis envoyée.' : 'SMTP non configuré dans Render.' });
  } catch (error) {
    console.error('Quote mail failed:', error.message);
    res.status(502).json({ error: 'Impossible d’envoyer la demande.' });
  }
});

app.post('/api/newsletter', async (req, res) => {
  if (!requiredFields(req.body, ['email'])) return res.status(400).json({ error: 'Adresse e-mail requise.' });
  try {
    const sent = await sendMessage({ replyTo: req.body.email, subject: '[TRS4 newsletter] Nouvelle inscription', text: `Inscription : ${req.body.email}` });
    res.status(sent ? 200 : 503).json({ sent, message: sent ? 'Inscription enregistrée.' : 'SMTP non configuré dans Render.' });
  } catch (error) {
    res.status(502).json({ error: 'Impossible d’enregistrer l’inscription.' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  if (!requiredFields(req.body, ['email', 'password']) || req.body.password.length < 8) {
    return res.status(400).json({ error: 'E-mail requis et mot de passe de 8 caractères minimum.' });
  }
  const email = req.body.email.trim().toLowerCase();
  if (accounts.has(email)) return res.status(409).json({ error: 'Ce compte existe déjà.' });
  const token = crypto.randomBytes(24).toString('hex');
  const passwordHash = crypto.scryptSync(req.body.password, process.env.AUTH_SALT || 'trs4-local-salt', 32).toString('hex');
  accounts.set(email, { passwordHash, token, verified: false });
  const sent = await sendMessage({ replyTo: email, subject: '[TRS4] Vérifie ton adresse e-mail', text: `Lien de vérification : ${process.env.PUBLIC_URL || 'http://localhost:3000'}/api/auth/verify?email=${encodeURIComponent(email)}&token=${token}` });
  res.status(201).json({ sent, message: sent ? 'Vérifie ta boîte mail.' : 'Compte créé. Configure SMTP pour recevoir le lien.' });
});

app.get('/api/auth/verify', (req, res) => {
  const account = accounts.get(String(req.query.email || '').toLowerCase());
  if (!account || account.token !== req.query.token) return res.status(400).send('Lien de vérification invalide.');
  account.verified = true;
  account.token = null;
  res.send('Adresse vérifiée. Tu peux revenir sur www.trs4.com.');
});

app.post('/api/auth/login', (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const account = accounts.get(email);
  if (!account || !requiredFields(req.body, ['password'])) return res.status(401).json({ error: 'Identifiants invalides.' });
  const hash = crypto.scryptSync(req.body.password, process.env.AUTH_SALT || 'trs4-local-salt', 32).toString('hex');
  if (hash !== account.passwordHash) return res.status(401).json({ error: 'Identifiants invalides.' });
  if (!account.verified) return res.status(403).json({ error: 'Adresse e-mail non vérifiée.' });
  res.json({ authenticated: true, email });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'www.trs4.com', api: 'v1' });
});

app.get('/api/profile', (req, res) => {
  res.json(siteData.profile);
});

app.get('/api/material', (req, res) => {
  res.json(siteData.material);
});

app.get('/api/progression', (req, res) => {
  res.json(siteData.progression);
});

app.get('/api/projects', (req, res) => {
  res.json(siteData.projects);
});

app.get('/api/meta', (req, res) => {
  res.json(siteData.meta);
});

app.get('/api/deploys', async (req, res) => {
  const apiKey = process.env.RENDER_API_KEY;
  const serviceId = process.env.RENDER_SERVICE_ID || 'srv-dahbflqjnfac7394cn9g';

  if (!apiKey) {
    return res.json({
      data: [],
      configured: false,
      message: 'Les déploiements Render ne sont pas configurés.'
    });
  }

  const requestedLimit = Number.parseInt(req.query.limit, 10);
  const limit = Number.isInteger(requestedLimit) && requestedLimit > 0
    ? Math.min(requestedLimit, 100)
    : 20;

  try {
    const response = await fetch(
      `https://api.render.com/v1/services/${serviceId}/deploys?limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: 'application/json'
        }
      }
    );

    if (!response.ok) {
      return res.status(response.status).json({
        error: 'Render API request failed'
      });
    }

    res.json(await response.json());
  } catch (error) {
    console.error('Render API request failed:', error.message);
    res.status(502).json({ error: 'Unable to reach Render API' });
  }
});

app.use(express.static(__dirname));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`TRS4 site running for https://www.trs4.com (local: http://localhost:${PORT})`);
});

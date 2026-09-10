const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

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
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80'
    },
    {
      title: 'Asus + Kali Linux',
      description: 'Environnement technique pour l’analyse réseau, les outils de sécurité et les manipulations en sandbox.',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80'
    },
    {
      title: 'Raspberry Pi',
      description: 'Plateforme compacte pour tester des configurations, des protocoles et des scénarios de réseau.',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80'
    },
    {
      title: 'Switchs',
      description: 'Utilisés pour simuler des échanges, faire des tests de topologie et comprendre les flux de données.',
      image: 'https://images.unsplash.com/photo-1558494949cc0b7f4af1b0a1e2b7f58b8?auto=format&fit=crop&w=900&q=80'
    },
    {
      title: 'Mon cerveau',
      description: 'Le vrai moteur du projet : analyse, réflexion, logique et capacité à concevoir des solutions concrètes.',
      image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=900&q=80'
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

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'trs4-site' });
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

app.use(express.static(__dirname));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`TRS4 site running on http://localhost:${PORT}`);
});

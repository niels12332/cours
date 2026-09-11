# www.trs4.com

Site personnel avec API Express.

## Démarrage local

```bash
npm install
npm start
```

Puis ouvrir :

```text
http://localhost:3000
```

## Déploiement sur Render

1. Connecte-toi à Render.
2. Crée un nouveau service Web.
3. Connecte ton dépôt GitHub.
4. Sélectionne le repo contenant ce projet.
5. Render utilisera automatiquement le fichier `render.yaml`.
6. Déploie le service.

Le site sera accessible via une URL Render gratuite, par exemple :

```text
https://www.trs4.com
```

## API

- `/api/health`
- `/api/profile`
- `/api/material`
- `/api/progression`
- `/api/projects`
- `/api/meta`
- `/api/deploys?limit=20`

### Déploiements Render

La route `/api/deploys` appelle Render côté serveur. Configure les variables
d'environnement suivantes dans Render ou dans ton terminal local :

```bash
RENDER_API_KEY=ta_cle_api_render
RENDER_SERVICE_ID=srv-dahbflqjnfac7394cn9g
```

`RENDER_SERVICE_ID` est facultative si tu utilises le service déjà configuré
dans `server.js`. La clé API ne doit pas être placée dans un fichier HTML ni
envoyée au navigateur.

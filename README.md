# www.trs4.com

Site personnel de Niels autour du développement web, des réseaux et de la
cybersécurité responsable. Le projet contient un portfolio, une page matériel,
un parcours de progression, un home lab pédagogique et une boutique de
matériel avec panier et paiement fictif.

## Comment le site est codé

- **HTML** construit les pages : `index.html`, `materiel.html`,
	`progression.html`, `projets.html`, `lab.html` et `shop.html`.
- **CSS** définit l’interface sombre, les panneaux, la grille responsive et
	les niveaux de progression dans `niels.css` et `shop.css`.
- **JavaScript** ajoute les interactions de la boutique dans `shop.js` :
	recherche, filtres, panier, total, compte local de démonstration et checkout
	fictif. Aucun paiement réel n’est effectué.
- **Node.js + Express** servent les fichiers et exposent les routes API dans
	`server.js` : santé du service, profil, matériel, progression, projets,
	métadonnées et déploiements Render.
- **Render** déploie le serveur à partir de `render.yaml`. Le serveur écoute
	sur le port fourni par Render et sur `0.0.0.0` pour être accessible en ligne.

Les images du matériel et de la boutique sont chargées depuis Unsplash avec un
texte alternatif. Les liens de documentation utilisés dans le home lab pointent
vers OWASP, Wireshark et MITRE ATT&CK. Les exercices de sécurité doivent rester
dans un environnement possédé ou explicitement autorisé.

## Démarrage local

```bash
npm install
npm start
```

Puis ouvrir :

```text
http://localhost:3000
```

Pour vérifier l’API :

```bash
curl http://localhost:3000/api/health
```

La réponse attendue contient `status: "ok"` et `service: "www.trs4.com"`.

## Déploiement sur Render

1. Connecte-toi à Render.
2. Crée un nouveau service Web.
3. Connecte ton dépôt GitHub.
4. Sélectionne le repo contenant ce projet.
5. Render utilisera automatiquement le fichier `render.yaml` et fournira le port HTTPS au serveur.
6. Déploie le service et note son URL Render, par exemple `https://trs4-com.onrender.com`.

Le site sera accessible via une URL Render gratuite, par exemple :

```text
https://trs4-com.onrender.com
```

### Domaine personnalisé

Le domaine racine et le sous-domaine `www` doivent être configurés dans le DNS
du registrar. Dans Render, ouvre **Settings > Custom Domains**, ajoute
`www.trs4.com`, puis crée chez le registrar un enregistrement CNAME :

```text
Nom       : www
Type      : CNAME
Cible     : l’URL Render indiquée par Render, sans https://
```

Pour le domaine racine `trs4.com`, utilise les enregistrements A indiqués par
Render. Supprime les anciens enregistrements contradictoires, puis attends la
propagation DNS. Tant que `www.trs4.com` n’a pas ce CNAME, il affichera
« serveur introuvable » même si le service Render fonctionne.

## API

- `/api/health`
- `/api/profile`
- `/api/material`
- `/api/progression`
- `/api/projects`
- `/api/meta`
- `/api/deploys?limit=20`
- `POST /api/contact`
- `POST /api/quote`
- `POST /api/newsletter`
- `POST /api/auth/register`, `GET /api/auth/verify`, `POST /api/auth/login`

### Réception des messages

Copie `.env.example` vers un environnement local ou ajoute ces variables dans
Render. Le fichier `.env.example` ne contient aucun secret réel. Il faut
utiliser le serveur SMTP du fournisseur de la boîte `theo.rslllhck@trs4.com` :

```text
CONTACT_EMAIL=theo.rslllhck@trs4.com
SMTP_HOST=smtp.ionos.fr
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=theo.rslllhck@trs4.com
SMTP_PASS=mot de passe SMTP ou mot de passe d’application
SMTP_FROM=theo.rslllhck@trs4.com
PUBLIC_URL=https://www.trs4.com
AUTH_SALT=une longue valeur aléatoire
```

Sans ces variables, les formulaires répondent proprement mais ne peuvent pas
envoyer de mail. Le mot de passe SMTP ne doit jamais être placé dans GitHub.
L’authentification Google nécessite en plus un identifiant OAuth créé dans
Google Cloud ; elle ne doit pas être simulée avec un simple bouton HTML.

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

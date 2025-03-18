
# Guide de déploiement - TopCenter

Ce guide explique comment déployer l'application TopCenter en utilisant différentes méthodes.

## Déploiement en local

### Prérequis
- Node.js (v18 ou supérieur)
- npm (v7 ou supérieur)

### Étapes

1. Clonez le dépôt:
   ```bash
   git clone https://github.com/votre-organisation/topcenter.git
   cd topcenter
   ```

2. Installez les dépendances:
   ```bash
   npm install
   ```

3. Créez un fichier `.env` à partir du modèle:
   ```bash
   cp .env.example .env
   ```

4. Remplissez le fichier `.env` avec vos variables d'environnement:
   ```
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

5. Lancez l'application en mode développement:
   ```bash
   npm run dev
   ```

6. Pour construire l'application pour la production:
   ```bash
   npm run build
   ```

7. Pour prévisualiser la version de production localement:
   ```bash
   npm run preview
   ```

## Déploiement avec Docker

### Prérequis
- Docker et Docker Compose installés

### Étapes

1. Assurez-vous que votre fichier `.env` est configuré avec les variables nécessaires

2. Construisez et démarrez les conteneurs:
   ```bash
   docker-compose up -d
   ```

3. L'application sera disponible sur http://localhost:3000

4. Pour arrêter les conteneurs:
   ```bash
   docker-compose down
   ```

### Variables d'environnement Docker

Vous pouvez personnaliser le déploiement Docker en définissant des variables d'environnement:

- Dans un fichier `.env` à la racine du projet
- En les passant directement à la commande docker-compose:
  ```bash
  VITE_SUPABASE_URL=your-url VITE_SUPABASE_ANON_KEY=your-key docker-compose up -d
  ```

## Déploiement sur un serveur de production

### Utilisation de Nginx comme proxy inverse

1. Créez une configuration Nginx:

```nginx
server {
    listen 80;
    server_name votre-domaine.com www.votre-domaine.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

2. Enregistrez ce fichier dans `/etc/nginx/sites-available/topcenter`

3. Activez le site:
```bash
sudo ln -s /etc/nginx/sites-available/topcenter /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Configuration HTTPS avec Let's Encrypt

1. Installez Certbot:
```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx
```

2. Obtenez un certificat:
```bash
sudo certbot --nginx -d votre-domaine.com -d www.votre-domaine.com
```

3. Renouvelez automatiquement votre certificat:
```bash
sudo certbot renew --dry-run
```

## Déploiement sur des plateformes cloud

### Netlify

1. Installez l'outil CLI Netlify:
```bash
npm install netlify-cli -g
```

2. Connectez-vous à votre compte:
```bash
netlify login
```

3. Initialisez votre projet:
```bash
netlify init
```

4. Déployez votre site:
```bash
netlify deploy --prod
```

### Vercel

1. Installez l'outil CLI Vercel:
```bash
npm install -g vercel
```

2. Connectez-vous à votre compte:
```bash
vercel login
```

3. Déployez votre projet:
```bash
vercel --prod
```

## Surveillance et maintenance

### Outils recommandés

- **Logs Docker**: `docker-compose logs -f`
- **Prometheus & Grafana**: Pour la surveillance des métriques
- **Sentry**: Pour la surveillance des erreurs frontend
- **UptimeRobot**: Pour vérifier que votre site est en ligne

### Sauvegarde et restauration

1. **Base de données**: Suivez les guides de sauvegarde de Supabase
2. **Fichiers statiques**: Assurez-vous de sauvegarder régulièrement vos contenus statiques

## En cas de problème

1. Vérifiez les logs de l'application
2. Vérifiez que toutes les variables d'environnement sont correctement définies
3. Redémarrez les conteneurs: `docker-compose restart`
4. Vérifiez l'état de votre connexion Supabase

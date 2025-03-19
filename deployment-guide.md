
# Guide de déploiement - TopCenter

Ce guide explique comment déployer l'application TopCenter en utilisant différentes méthodes.

## Table des matières
1. [Déploiement en local](#déploiement-en-local)
2. [Déploiement avec Docker](#déploiement-avec-docker)
3. [Déploiement sur un serveur de production](#déploiement-sur-un-serveur-de-production)
4. [CI/CD avec GitHub Actions](#cicd-avec-github-actions)
5. [Gestion des Feature Flags](#gestion-des-feature-flags)
6. [Surveillance et maintenance](#surveillance-et-maintenance)

## Déploiement en local

### Prérequis
- Node.js (v18 ou supérieur)
- npm (v7 ou supérieur)
- MySQL (v8.0 ou supérieur)

### Étapes pour le frontend

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

### Étapes pour le backend

1. Configurez MySQL:
   ```bash
   mysql -u root -p
   ```

2. Dans le prompt MySQL, créez la base de données et l'utilisateur:
   ```sql
   CREATE DATABASE topcenter_db;
   CREATE USER 'topcenter'@'localhost' IDENTIFIED BY 'your-secure-password';
   GRANT ALL PRIVILEGES ON topcenter_db.* TO 'topcenter'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```

3. Naviguez vers le dossier backend:
   ```bash
   cd backend
   ```

4. Installez les dépendances:
   ```bash
   npm install
   ```

5. Configurez les variables d'environnement:
   ```
   DB_HOST=localhost
   DB_USER=topcenter
   DB_PASSWORD=your-secure-password
   DB_NAME=topcenter_db
   PORT=4000
   ```

6. Initialisez la base de données (si non utilisé avec Docker):
   ```bash
   mysql -u topcenter -p topcenter_db < db-init/01-schema.sql
   ```

7. Lancez le serveur:
   ```bash
   npm start
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

3. L'application sera disponible sur:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000

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

### Configuration du serveur

1. Installez Docker et Docker Compose sur votre serveur:
   ```bash
   sudo apt update
   sudo apt install docker.io docker-compose
   ```

2. Clonez le dépôt:
   ```bash
   git clone https://github.com/votre-organisation/topcenter.git
   cd topcenter
   ```

3. Créez le fichier `.env` avec les variables de production

4. Lancez l'application:
   ```bash
   docker-compose up -d
   ```

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

    location /api {
        proxy_pass http://localhost:4000;
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

## CI/CD avec GitHub Actions

Le fichier `.github/workflows/deploy.yml` définit un pipeline CI/CD qui:

1. Exécute les tests à chaque push sur `main` ou pull request
2. Construit et pousse l'image Docker sur DockerHub (uniquement pour les push sur `main`)
3. Déploie l'application sur le serveur de production via SSH

### Configuration requise:

1. Ajoutez les secrets GitHub suivants:
   - `DOCKERHUB_USERNAME`: Votre nom d'utilisateur DockerHub
   - `DOCKERHUB_TOKEN`: Votre token d'accès DockerHub
   - `SERVER_HOST`: L'adresse IP ou le nom d'hôte de votre serveur
   - `SERVER_USERNAME`: Nom d'utilisateur SSH
   - `SSH_PRIVATE_KEY`: Clé SSH privée pour l'accès au serveur
   - `VITE_SUPABASE_URL`: URL Supabase
   - `VITE_SUPABASE_ANON_KEY`: Clé anonyme Supabase

2. Modifiez le tag Docker dans le workflow pour correspondre à votre nom d'utilisateur DockerHub

## Gestion des Feature Flags

TopCenter utilise des feature flags pour activer/désactiver des fonctionnalités sans redéploiement.

### Flags disponibles:

- `FEATURE_CHATBOT`: Active/désactive le chatbot
- `FEATURE_ANALYTICS`: Active/désactive les fonctionnalités d'analytique

### Utilisation:

1. Modifiez les variables d'environnement dans le fichier `.env`:
   ```
   FEATURE_CHATBOT=true
   FEATURE_ANALYTICS=false
   ```

2. Redémarrez l'application (en mode développement ou docker-compose)

## Surveillance et maintenance

### Journaux Docker

Pour afficher les journaux de l'application:
```bash
docker-compose logs -f
```

### Journaux de l'application

Les journaux de l'application sont stockés dans `backend/logs/`

### Mise à jour de l'application

1. Tirez les dernières modifications:
   ```bash
   git pull origin main
   ```

2. Reconstruisez et redémarrez les conteneurs:
   ```bash
   docker-compose up -d --build
   ```

### Sauvegarde de la base de données

Sauvegardez régulièrement la base de données:
```bash
docker exec -it topcenter_mysql mysqldump -u root -p topcenter_db > backup-$(date +%F).sql
```

### Surveillance avec PM2

Le backend utilise PM2 pour la gestion des processus:

```bash
# Afficher les logs
docker exec -it topcenter-app pm2 logs

# Voir le statut des processus
docker exec -it topcenter-app pm2 status

# Redémarrer un processus
docker exec -it topcenter-app pm2 restart topcenter-backend
```

## En cas de problème

1. Vérifiez les logs de l'application
2. Vérifiez que toutes les variables d'environnement sont correctement définies
3. Redémarrez les conteneurs: `docker-compose restart`
4. Assurez-vous que MySQL est correctement configuré

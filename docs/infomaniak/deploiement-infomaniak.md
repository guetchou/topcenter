
# Déploiement sur Infomaniak

Ce guide explique comment déployer l'application TopCenter sur un hébergement Infomaniak.

## Création d'une base de données MySQL

1. Connectez-vous à votre Manager Infomaniak
2. Allez dans "Hébergement Web & Cloud" > Votre hébergement > "Bases de données"
3. Cliquez sur "Créer une base de données"
4. Choisissez MySQL et remplissez les informations (nom, utilisateur, mot de passe)
5. Notez les informations de connexion qui vous seront fournies

## Déploiement du backend

1. Connectez-vous au SSH de votre hébergement Infomaniak (disponible dans les plans Pro et supérieurs)
2. Naviguez vers le dossier approprié pour votre API (généralement un sous-dossier de votre www):
   ```bash
   cd ~/www/votre-domaine.com/api
   ```

3. Clonez votre dépôt Git:
   ```bash
   git clone https://github.com/votre-organisation/topcenter.git .
   ```

4. Installez les dépendances du backend:
   ```bash
   cd backend
   npm install --production
   ```

5. Créez un fichier `.env` pour les variables d'environnement:
   ```bash
   nano .env
   ```

   Ajoutez les informations de connexion à la base de données:
   ```
   DB_HOST=hostname.infomaniak.com
   DB_USER=votre_utilisateur
   DB_PASSWORD=votre_mot_de_passe
   DB_NAME=votre_base_de_donnees
   PORT=9000

   # Feature Flags
   FEATURE_CHATBOT=true
   FEATURE_ANALYTICS=true
   # Autres variables d'environnement...
   ```

6. Configurez PM2 pour gérer votre application Node.js:
   ```bash
   npm install -g pm2
   pm2 start server.js --name topcenter-backend
   pm2 save
   pm2 startup
   ```

## Déploiement manuel du frontend

1. Connectez-vous à votre hébergement via FTP
2. Naviguez vers le dossier root de votre site (par exemple, `www/votre-domaine.com`)
3. Téléchargez le contenu du dossier `dist` (généré après le build) dans ce dossier

## Configuration des redirections et du serveur web

1. Créez un fichier `.htaccess` à la racine de votre site:
   ```
   # Rediriger toutes les requêtes API vers le backend Node.js
   RewriteEngine On
   RewriteRule ^api/(.*)$ http://localhost:9000/$1 [P,L]

   # Pour le SPA: rediriger toutes les requêtes non-fichiers vers index.html
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule ^(.*)$ /index.html [L]
   ```

2. Si vous utilisez le système de sites Node.js d'Infomaniak, configurez-le pour pointer vers votre application backend.

## Configuration HTTPS

1. Dans le Manager Infomaniak, allez dans "Hébergement Web & Cloud" > Votre hébergement > "SSL/TLS"
2. Activez le certificat SSL gratuit Let's Encrypt

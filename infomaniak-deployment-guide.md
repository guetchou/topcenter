# Guide de Déploiement sur Infomaniak - TopCenter

Ce guide explique comment déployer l'application TopCenter sur un hébergement Infomaniak.

## Table des matières
1. [Prérequis](#prérequis)
2. [Préparation du projet](#préparation-du-projet)
3. [Déploiement sur Infomaniak](#déploiement-sur-infomaniak)
4. [Configuration du nom de domaine](#configuration-du-nom-de-domaine)
5. [Mise en place de l'environnement de production](#mise-en-place-de-lenvironnement-de-production)
6. [Déploiement automatique avec GitHub Actions](#déploiement-automatique-avec-github-actions)
7. [Tableau de bord de déploiement](#tableau-de-bord-de-déploiement)
8. [Dépannage](#dépannage)

## Prérequis

- Un compte Infomaniak avec un plan d'hébergement Web + MySQL
- Accès FTP à votre hébergement Infomaniak
- Client FTP (FileZilla, WinSCP, etc.)
- Git installé sur votre machine locale
- Node.js et NPM installés sur votre machine locale

## Préparation du projet

1. Construisez l'application frontend:
   ```bash
   # Dans le dossier racine du projet
   npm run build
   ```
   
   Cela créera un dossier `dist` contenant les fichiers statiques du frontend.

2. Vérifiez votre configuration API:
   
   Assurez-vous que dans `src/services/api.ts`, la baseURL est correctement configurée:
   ```typescript
   baseURL: process.env.NODE_ENV === 'production' 
     ? '/api' 
     : 'http://localhost:3000/api',
   ```

## Déploiement sur Infomaniak

### 1. Création d'une base de données MySQL

1. Connectez-vous à votre Manager Infomaniak
2. Allez dans "Hébergement Web & Cloud" > Votre hébergement > "Bases de données"
3. Cliquez sur "Créer une base de données"
4. Choisissez MySQL et remplissez les informations (nom, utilisateur, mot de passe)
5. Notez les informations de connexion qui vous seront fournies

### 2. Déploiement du backend

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

### 3. Déploiement manuel du frontend (alternative au déploiement automatique)

1. Connectez-vous à votre hébergement via FTP
2. Naviguez vers le dossier root de votre site (par exemple, `www/votre-domaine.com`)
3. Téléchargez le contenu du dossier `dist` (généré après le build) dans ce dossier

### 4. Configuration des redirections et du serveur web

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

## Configuration du nom de domaine

1. Dans le Manager Infomaniak, allez dans "Noms de domaine" > Votre domaine
2. Configurez les enregistrements DNS pour pointer vers votre hébergement Infomaniak

## Mise en place de l'environnement de production

### Configurer HTTPS

1. Dans le Manager Infomaniak, allez dans "Hébergement Web & Cloud" > Votre hébergement > "SSL/TLS"
2. Activez le certificat SSL gratuit Let's Encrypt

### Configurer les sauvegardes

1. Dans le Manager Infomaniak, allez dans "Hébergement Web & Cloud" > Votre hébergement > "Sauvegardes"
2. Configurez la fréquence des sauvegardes automatiques

## Déploiement automatique avec GitHub Actions

Pour automatiser le déploiement de votre application vers Infomaniak à chaque push sur la branche principale, vous pouvez utiliser GitHub Actions avec FTP.

### 1. Configuration des secrets GitHub

Ajoutez les secrets suivants dans votre dépôt GitHub (Settings → Secrets and variables → Actions):

| Nom | Description | Exemple |
|-----|-------------|---------|
| `FTP_SERVER` | Adresse du serveur FTP d'Infomaniak | ftp.cluster0xy.hosting.infomaniak.ch |
| `FTP_USER` | Nom d'utilisateur FTP | user_ftp |
| `FTP_PASS` | Mot de passe FTP | votre_mot_de_passe |
| `VITE_SUPABASE_URL` | URL de votre projet Supabase | https://votre-projet.supabase.co |
| `VITE_SUPABASE_ANON_KEY` | Clé anonyme Supabase | votre_clé_anonyme |

### 2. Workflow GitHub Actions

Un fichier `.github/workflows/deploy.yml` a été créé dans votre projet. Ce workflow:
- Est déclenché à chaque push sur la branche `main`
- Installe les dépendances et exécute les tests
- Build le projet avec les variables d'environnement nécessaires
- Déploie les fichiers générés vers votre hébergement Infomaniak via FTP

### 3. Dépannage du déploiement automatique

Si le déploiement automatique échoue, vérifiez:
- Les logs du workflow dans GitHub Actions
- Assurez-vous que les secrets sont correctement configurés
- Vérifiez que les informations FTP sont correctes
- Assurez-vous que l'utilisateur FTP a les droits d'écriture sur le dossier cible

## Tableau de bord de déploiement

TopCenter dispose d'un tableau de bord de déploiement intégré qui vous permet de:

1. Lancer des déploiements manuels depuis l'interface utilisateur
2. Effectuer des sauvegardes à la demande
3. Suivre l'état des déploiements en temps réel
4. Consulter les logs de déploiement

### Accès au tableau de bord de déploiement

Le tableau de bord de déploiement est accessible à deux endroits:

1. Pour les administrateurs, via `/admin/deploy`
2. En accès direct via `/deploy` (nécessite une connexion)

### Fonctionnalités du tableau de bord

- **Déploiement en un clic**: Lancez le processus de déploiement complet (sauvegarde, build, déploiement)
- **Sauvegarde indépendante**: Effectuez uniquement une sauvegarde sans déploiement
- **Logs en temps réel**: Suivez chaque étape du processus de déploiement
- **Monitoring du serveur**: Vérifiez l'état des services (Infomaniak, base de données, GitHub Actions)

### Sécurité

Le tableau de bord est protégé et nécessite une connexion avec des droits d'administration. Toutes les actions sensibles sont enregistrées dans les logs système.

## Dépannage

### Les requêtes API échouent

1. Vérifiez que le service Node.js est en cours d'exécution:
   ```bash
   pm2 status
   ```

2. Vérifiez les logs:
   ```bash
   pm2 logs topcenter-backend
   ```

3. Assurez-vous que le fichier `.htaccess` est correctement configuré

### Problèmes de base de données

1. Vérifiez les informations de connexion dans le fichier `.env`
2. Assurez-vous que votre adresse IP est autorisée à accéder à la base de données (dans le Manager Infomaniak > Bases de données > Sécurité)

### Problèmes de performance

1. Activez le cache HTTP dans Infomaniak
2. Optimisez les images et assets statiques
3. Configurez la compression gzip via le fichier `.htaccess`:
   ```
   # Enable gzip compression
   <IfModule mod_deflate.c>
     AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/x-javascript application/json
   </IfModule>
   ```

### Problèmes de déploiement automatique

Si le déploiement automatique via le tableau de bord échoue:

1. Vérifiez les logs de déploiement dans le tableau de bord
2. Vérifiez les workflows GitHub Actions pour plus de détails
3. Essayez un déploiement manuel via FTP comme solution de contournement

Pour toute assistance supplémentaire, contactez le support Infomaniak ou consultez leur documentation officielle.

## Configuration de la base de données MariaDB

TopCenter utilise une base de données MariaDB hébergée sur Infomaniak. Voici les informations de connexion et les étapes pour configurer correctement la base de données:

### Informations de connexion MariaDB
- **Serveur hôte**: rj8dl.myd.infomaniak.com
- **Port**: 3306
- **Version**: MariaDB 10.4

### Étapes de migration vers MariaDB 10.6 (facultatif)
Si vous souhaitez migrer de MariaDB 10.4 vers 10.6:

1. Connectez-vous au Manager Infomaniak
2. Accédez à la section "Hébergement Web & Cloud" > Votre hébergement > "Bases de données"
3. Sélectionnez votre base de données
4. Cliquez sur "Options avancées" puis choisissez "Migrer vers MariaDB 10.6"
5. Suivez les instructions à l'écran pour effectuer la migration

**Note importante:** Avant de migrer, assurez-vous de:
- Faire une sauvegarde complète de votre base de données
- Vérifier la compatibilité de votre application avec MariaDB 10.6
- Planifier la migration pendant une période de faible trafic

### Configuration des variables d'environnement

Pour sécuriser vos informations de connexion à la base de données, configurez les variables d'environnement suivantes dans votre environnement de déploiement:

```
DB_HOST=rj8dl.myd.infomaniak.com
DB_PORT=3306
DB_USER=votre_nom_utilisateur
DB_PASSWORD=votre_mot_de_passe
DB_NAME=votre_nom_base_de_donnees
DB_SSL=false
```

Pour les déploiements GitHub Actions, ajoutez ces variables comme secrets dans le dépôt GitHub.


# TopCenter Backend API

API backend pour l'application TopCenter, construite avec Node.js, Express et MySQL.

## Configuration

### Prérequis
- Node.js 18+
- MySQL 8.0+
- npm ou yarn

### Installation

1. Cloner le repository
```bash
git clone <repository-url>
cd backend
```

2. Installer les dépendances
```bash
npm install
```

3. Configurer les variables d'environnement
```bash
cp .env.example .env
# Éditer le fichier .env avec vos paramètres
```

4. Créer la base de données
```sql
CREATE DATABASE topcenter_db;
```

5. Exécuter les migrations
```bash
mysql -u your_user -p topcenter_db < db/migrations/001_create_users_table.sql
mysql -u your_user -p topcenter_db < db/migrations/002_create_deployments_table.sql
```

### Démarrage

#### Développement
```bash
npm run dev
```

#### Production
```bash
npm start
```

#### Avec PM2
```bash
pm2 start ecosystem.config.js
```

## API Endpoints

### Authentification (`/api/auth`)
- `POST /register` - Inscription
- `POST /login` - Connexion
- `POST /reset-password` - Réinitialisation mot de passe

### Utilisateurs (`/api/users`)
- `GET /profile` - Profil utilisateur (authentifié)
- `PUT /profile` - Mise à jour profil (authentifié)
- `PUT /password` - Changement mot de passe (authentifié)

### Déploiements (`/api/deploy`)
- `POST /trigger` - Déclencher un déploiement (authentifié)
- `GET /status/:id` - Statut d'un déploiement (authentifié)
- `GET /history` - Historique des déploiements (authentifié)

### Utilitaires
- `GET /healthcheck` - Vérification de santé
- `GET /api` - Informations sur l'API

## Structure du projet

```
backend/
├── db/
│   ├── connection.js          # Configuration base de données
│   └── migrations/            # Scripts de migration
├── middleware/
│   ├── auth.js               # Middleware d'authentification
│   ├── rateLimiter.js        # Limitation de taux
│   └── validation.js         # Validation des données
├── routes/
│   ├── auth.js               # Routes d'authentification
│   ├── users.js              # Routes utilisateurs
│   └── deploy.js             # Routes de déploiement
├── utils/
│   ├── logger.js             # Système de logs
│   └── responseHelper.js     # Helpers pour les réponses
├── .env.example              # Exemple de configuration
├── ecosystem.config.js       # Configuration PM2
├── package.json
└── server.js                 # Point d'entrée
```

## Sécurité

- JWT pour l'authentification
- Rate limiting
- Helmet pour les headers de sécurité
- Validation des données avec Joi
- Hashage des mots de passe avec bcrypt
- CORS configuré

## Logs

Les logs sont gérés par Winston et stockés dans le dossier `logs/`:
- `combined.log` - Tous les logs
- `err.log` - Erreurs uniquement
- `out.log` - Sorties standard

## Variables d'environnement

Voir `.env.example` pour la liste complète des variables requises.

## Production

Pour le déploiement en production :

1. Configurer les variables d'environnement de production
2. Utiliser PM2 pour la gestion des processus
3. Configurer un reverse proxy (nginx)
4. Mettre en place le monitoring des logs
5. Configurer les sauvegardes de base de données



# TopCenter - Centre d'Appels Nouvelle Génération

## À propos du projet

TopCenter est une solution de centre d'appels de nouvelle génération optimisée pour la relation client, combinant technologie omnicanale et intelligence artificielle.

## Architecture du projet

Ce projet utilise une architecture client-serveur:
- **Frontend**: Application React avec TypeScript, Vite et Tailwind CSS
- **Backend**: API Node.js/Express.js avec MySQL
- **Infrastructure**: Docker pour la containerisation et déploiement

## Installation et démarrage du projet en local

### Prérequis
- Node.js (v18 ou supérieur)
- npm (inclus avec Node.js)
- Docker et Docker Compose (pour le déploiement conteneurisé)

### Installation

Suivez ces étapes pour installer et démarrer le projet en local :

```sh
# 1. Cloner le dépôt
git clone https://github.com/votre-username/topcenter.git
cd topcenter

# 2. Installer les dépendances du frontend
npm install

# 3. Installer les dépendances du backend
cd backend
npm install
cd ..

# 4. Copier le fichier d'environnement d'exemple
cp .env.example .env

# 5. Configurer les variables d'environnement dans le fichier .env
# VITE_SUPABASE_URL=your-supabase-url
# VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
# DB_USER=topcenter
# DB_PASSWORD=your-secure-password
# DB_NAME=topcenter_db
# MYSQL_ROOT_PASSWORD=your-root-password

# 6. Démarrer l'application avec Docker Compose
docker-compose up -d

# Pour le développement frontend uniquement sans Docker:
npm run dev
```

Votre application sera disponible à l'adresse:
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:4000](http://localhost:4000)

## Structure du projet

```
topcenter/
├── src/                  # Code source frontend
│   ├── components/       # Composants React réutilisables
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Pages principales de l'application
│   └── services/         # Services et intégrations
├── backend/              # Code source backend
│   ├── db/               # Configuration de la base de données
│   ├── routes/           # Routes de l'API
│   ├── middleware/       # Middleware Express
│   ├── utils/            # Utilitaires et helpers
│   └── db-init/          # Scripts d'initialisation MySQL
├── public/               # Ressources statiques
└── Dockerfile, docker-compose.yml  # Configuration Docker
```

## Déploiement avec Docker

### Construction et démarrage de l'application

```sh
# 1. Vérifier que le fichier .env contient les variables nécessaires

# 2. Construire et démarrer les conteneurs Docker
docker-compose up -d

# 3. Pour vérifier les logs
docker-compose logs -f
```

## Branche de développement et workflow Git

Ce projet suit un workflow Git basé sur les branches:

- `main`: Version stable de production
- `develop`: Environnement de développement
- `feature-*`: Fonctionnalités en cours de développement

## Feature Flags

L'application utilise des feature flags pour activer/désactiver dynamiquement certaines fonctionnalités:

- `FEATURE_CHATBOT`: Active le chatbot intégré
- `FEATURE_ANALYTICS`: Active les fonctionnalités d'analyse

Pour modifier ces flags, mettez à jour les variables dans le fichier `.env`.

## Technologies utilisées

### Frontend
- Vite
- TypeScript
- React
- Tailwind CSS
- shadcn-ui
- Supabase (backend as a service)
- Framer Motion (animations)

### Backend
- Node.js
- Express.js
- MySQL
- JWT pour l'authentification
- Winston pour les logs
- PM2 pour la gestion des processus

### DevOps
- Docker et Docker Compose
- GitHub Actions pour CI/CD

## Contact

TopCenter - [contact@topcenter.com](mailto:contact@topcenter.com)

Site web - [https://topcenter.com](https://topcenter.com)

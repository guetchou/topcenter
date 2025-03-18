
# TopCenter - Centre d'Appels Nouvelle Génération

## À propos du projet

TopCenter est une solution de centre d'appels de nouvelle génération optimisée pour la relation client, combinant technologie omnicanale et intelligence artificielle.

## Installation et démarrage du projet en local

### Prérequis
- Node.js (v18 ou supérieur)
- npm (inclus avec Node.js)

### Installation

Suivez ces étapes pour installer et démarrer le projet en local :

```sh
# 1. Cloner le dépôt
git clone https://github.com/votre-username/topcenter.git
cd topcenter

# 2. Installer les dépendances
npm install

# 3. Copier le fichier d'environnement d'exemple
cp .env.example .env

# 4. Configurer les variables d'environnement
# Modifiez le fichier .env avec vos propres valeurs
# VITE_SUPABASE_URL=your-supabase-url
# VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# 5. Démarrer le serveur de développement
npm run dev
```

Votre application sera disponible à l'adresse [http://localhost:5173](http://localhost:5173).

## Déploiement avec Docker

### Prérequis
- Docker et Docker Compose installés sur votre machine ou serveur

### Construction et démarrage de l'application

```sh
# 1. Créer un fichier .env à la racine du projet
# Assurez-vous qu'il contient les variables nécessaires:
# VITE_SUPABASE_URL=your-supabase-url
# VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# 2. Construire et démarrer les conteneurs Docker
docker-compose up -d

# 3. Pour vérifier les logs
docker-compose logs -f
```

L'application sera disponible à l'adresse [http://localhost:3000](http://localhost:3000).

### Commandes Docker utiles

```sh
# Arrêter les conteneurs
docker-compose down

# Reconstruire les conteneurs après des modifications
docker-compose up -d --build

# Afficher les conteneurs en cours d'exécution
docker ps
```

## Structure du projet

- `src/` - Code source de l'application
  - `components/` - Composants React réutilisables
  - `hooks/` - Custom React hooks
  - `pages/` - Pages principales de l'application
  - `services/` - Services et intégrations

## Technologies utilisées

- Vite
- TypeScript
- React
- Tailwind CSS
- shadcn-ui
- Supabase (backend as a service)
- Framer Motion (animations)

## Déploiement en production

Pour un déploiement en production:

1. Assurez-vous d'avoir configuré les variables d'environnement appropriées
2. Optimisez les images et autres ressources statiques
3. Utilisez un service comme Netlify, Vercel, ou votre propre serveur avec Docker

## Contact

TopCenter - [contact@topcenter.com](mailto:contact@topcenter.com)

Site web - [https://topcenter.com](https://topcenter.com)

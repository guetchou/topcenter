
# Préparation du projet pour Infomaniak

Ce guide détaille les étapes de préparation du projet TopCenter avant son déploiement sur un hébergement Infomaniak.

## Construction de l'application frontend

1. Construisez l'application frontend:
   ```bash
   # Dans le dossier racine du projet
   npm run build
   ```
   
   Cela créera un dossier `dist` contenant les fichiers statiques du frontend.

## Vérification de la configuration API

Assurez-vous que dans `src/services/api.ts`, la baseURL est correctement configurée:
```typescript
baseURL: process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:3000/api',
```

## Préparation des variables d'environnement

1. Créez un fichier `.env` basé sur `.env.example` pour votre environnement de production
2. Renseignez toutes les variables requises, notamment:
   - Informations de connexion à la base de données
   - URL Supabase et clé anonyme
   - Configuration des Feature Flags

## Vérification des dépendances

Assurez-vous que toutes les dépendances nécessaires sont incluses dans `package.json`:

```bash
# Vérifiez que toutes les dépendances sont résolues
npm ci
```

## Préparation du fichier de déploiement automatique

Si vous prévoyez d'utiliser GitHub Actions pour le déploiement automatique, assurez-vous que le fichier `.github/workflows/deploy.yml` est correctement configuré avec les secrets appropriés.

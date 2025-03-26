
# Configuration de la base de données MariaDB

TopCenter utilise une base de données MariaDB hébergée sur Infomaniak. Ce guide explique comment configurer et optimiser votre base de données.

## Informations de connexion MariaDB
- **Serveur hôte**: rj8dl.myd.infomaniak.com
- **Port**: 3306
- **Version**: MariaDB 10.4

## Configuration des variables d'environnement

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

## Configuration du backend pour MariaDB

Dans le fichier `backend/db/connection.js`, assurez-vous que les options de connexion sont correctement configurées pour MariaDB:

```javascript
const dbConfig = {
  host: process.env.DB_HOST || 'rj8dl.myd.infomaniak.com',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Options spécifiques pour MariaDB 10.4
  charset: 'utf8mb4',
  ssl: process.env.DB_SSL === 'true' ? true : undefined
};
```

## Étapes de migration vers MariaDB 10.6 (facultatif)

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

## Optimisation des performances

Pour optimiser les performances de la base de données MariaDB sur Infomaniak:

1. Utilisez des index appropriés pour les requêtes fréquentes
2. Limitez le nombre de connexions simultanées (déjà configuré avec `connectionLimit: 10`)
3. Utilisez des transactions pour les opérations multiples
4. Implémentez la mise en cache pour les requêtes fréquentes et peu changeantes

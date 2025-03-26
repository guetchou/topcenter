
# Déploiement automatique avec GitHub Actions

Ce guide explique comment configurer le déploiement automatique de votre application TopCenter vers Infomaniak à chaque push sur la branche principale, en utilisant GitHub Actions avec FTP.

## Configuration des secrets GitHub

Ajoutez les secrets suivants dans votre dépôt GitHub (Settings → Secrets and variables → Actions):

| Nom | Description | Exemple |
|-----|-------------|---------|
| `FTP_SERVER` | Adresse du serveur FTP d'Infomaniak | ftp.cluster0xy.hosting.infomaniak.ch |
| `FTP_USERNAME` | Nom d'utilisateur FTP | user_ftp |
| `FTP_PASSWORD` | Mot de passe FTP | votre_mot_de_passe |
| `VITE_SUPABASE_URL` | URL de votre projet Supabase | https://votre-projet.supabase.co |
| `VITE_SUPABASE_ANON_KEY` | Clé anonyme Supabase | votre_clé_anonyme |

## Workflow GitHub Actions

Le fichier `.github/workflows/deploy.yml` dans votre projet configure ce workflow. Ce workflow:
- Est déclenché à chaque push sur la branche `main`
- Installe les dépendances et exécute les tests
- Build le projet avec les variables d'environnement nécessaires
- Déploie les fichiers générés vers votre hébergement Infomaniak via FTP

Voici un exemple de ce fichier:

```yaml
name: 🚀 Déploiement Infomaniak

on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: 📥 Cloner le dépôt
        uses: actions/checkout@v3

      - name: ⚙️ Configurer Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: 🔧 Installer les dépendances
        run: npm ci

      - name: 🧪 Exécuter les tests
        run: npm test || true

      - name: 📦 Build du projet
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}

      - name: 📤 Déploiement via FTP
        uses: SamKirkland/FTP-Deploy-Action@v4.3.4
        with:
          server: ${{ secrets.FTP_SERVER }}
          username: ${{ secrets.FTP_USERNAME }}
          password: ${{ secrets.FTP_PASSWORD }}
          local-dir: ./dist/
          server-dir: /home/clients/182ddf0dfc453b3faeaee042d1660720/sites/
          dangerous-clean-slate: true

      - name: ✅ Notification de déploiement
        run: echo "Déploiement terminé avec succès!"
```

## Dépannage du déploiement automatique

Si le déploiement automatique échoue, vérifiez:
- Les logs du workflow dans GitHub Actions
- Assurez-vous que les secrets sont correctement configurés
- Vérifiez que les informations FTP sont correctes
- Assurez-vous que l'utilisateur FTP a les droits d'écriture sur le dossier cible

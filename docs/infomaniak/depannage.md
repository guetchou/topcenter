
# Dépannage

Ce guide vous aide à résoudre les problèmes courants lors du déploiement et de l'exécution de TopCenter sur Infomaniak.

## Les requêtes API échouent

1. Vérifiez que le service Node.js est en cours d'exécution:
   ```bash
   pm2 status
   ```

2. Vérifiez les logs:
   ```bash
   pm2 logs topcenter-backend
   ```

3. Assurez-vous que le fichier `.htaccess` est correctement configuré

4. Vérifiez que les règles de réécriture sont actives:
   ```bash
   # Dans le fichier .htaccess
   RewriteEngine On
   RewriteRule ^api/(.*)$ http://localhost:9000/$1 [P,L]
   ```

## Problèmes de base de données

1. Vérifiez les informations de connexion dans le fichier `.env`
2. Assurez-vous que votre adresse IP est autorisée à accéder à la base de données (dans le Manager Infomaniak > Bases de données > Sécurité)
3. Testez la connexion directement:
   ```bash
   mysql -h rj8dl.myd.infomaniak.com -u votre_utilisateur -p
   ```

## Problèmes de performance

1. Activez le cache HTTP dans Infomaniak
2. Optimisez les images et assets statiques
3. Configurez la compression gzip via le fichier `.htaccess`:
   ```
   # Enable gzip compression
   <IfModule mod_deflate.c>
     AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/x-javascript application/json
   </IfModule>
   ```

## Problèmes de déploiement automatique

Si le déploiement automatique via GitHub Actions échoue:

1. Vérifiez les logs dans GitHub Actions
2. Assurez-vous que les secrets sont correctement configurés
3. Vérifiez les permissions du répertoire cible sur le serveur FTP
4. Validez que l'utilisateur FTP a accès au chemin spécifié

## Erreurs 500 Internal Server Error

1. Vérifiez les logs d'erreur Apache:
   ```bash
   cat /var/log/apache2/error.log
   ```

2. Assurez-vous que PHP est correctement configuré (si nécessaire)

3. Vérifiez que le module `mod_proxy` est activé pour les redirections d'API

## Assistance supplémentaire

Pour toute assistance supplémentaire:
- Contactez le support Infomaniak
- Consultez la documentation officielle d'Infomaniak
- Utilisez le système de tickets d'Infomaniak via le Manager

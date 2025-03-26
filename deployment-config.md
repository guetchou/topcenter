
# Configuration du déploiement TopCenter

Ce document détaille la configuration de déploiement pour le site TopCenter.

## Informations de serveur

### Adresses IP
- IPv4: 128.65.195.241
- IPv6: 2001:1600:4:b:2eea:7fff:fe58:e228

### Connexion au serveur
Pour se connecter au serveur via SSH:
```bash
ssh user@128.65.195.241
```

Ou en utilisant l'IPv6:
```bash
ssh user@2001:1600:4:b:2eea:7fff:fe58:e228
```

## Configuration DNS

Assurez-vous que les entrées DNS suivantes sont configurées pour votre domaine:

```
A     @     128.65.195.241
AAAA  @     2001:1600:4:b:2eea:7fff:fe58:e228
```

## Vérification de la connexion

Pour vérifier que votre site est accessible via les adresses IP:

```bash
# Vérifier l'IPv4
curl -I http://128.65.195.241

# Vérifier l'IPv6
curl -I -6 http://[2001:1600:4:b:2eea:7fff:fe58:e228]
```

## Notes importantes

1. Assurez-vous que les ports 80 (HTTP) et 443 (HTTPS) sont ouverts sur le serveur.
2. Configurez correctement le pare-feu pour autoriser uniquement le trafic nécessaire.
3. Pour le déploiement automatique, assurez-vous d'ajouter les secrets GitHub appropriés:
   - `FTP_SERVER`
   - `FTP_USERNAME`
   - `FTP_PASSWORD`

## Déploiement manuel

Si vous souhaitez déployer manuellement:

```bash
# Build du projet
npm run build

# Transfert des fichiers via scp
scp -r ./dist/* user@128.65.195.241:/chemin/vers/dossier/public
```

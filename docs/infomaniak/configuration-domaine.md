
# Configuration du nom de domaine

Ce guide explique comment configurer le nom de domaine pour votre application TopCenter sur Infomaniak.

## Configuration DNS

1. Dans le Manager Infomaniak, allez dans "Noms de domaine" > Votre domaine
2. Configurez les enregistrements DNS pour pointer vers votre hébergement Infomaniak

Si vous utilisez l'adresse IP directement:
```
A     @     128.65.195.241
AAAA  @     2001:1600:4:b:2eea:7fff:fe58:e228
```

## Sous-domaines

Si vous souhaitez utiliser des sous-domaines pour différentes parties de l'application:

1. Ajoutez les enregistrements DNS pour chaque sous-domaine:
   ```
   A     api     128.65.195.241
   AAAA  api     2001:1600:4:b:2eea:7fff:fe58:e228
   ```

2. Configurez les hôtes virtuels dans votre serveur web pour gérer chaque sous-domaine

## Redirection www vers domaine principal

Pour rediriger www.votre-domaine.com vers votre-domaine.com:

1. Ajoutez un enregistrement DNS pour www:
   ```
   A     www     128.65.195.241
   AAAA  www     2001:1600:4:b:2eea:7fff:fe58:e228
   ```

2. Configurez la redirection dans le Manager Infomaniak:
   - Allez dans "Noms de domaine" > Votre domaine > "Redirections"
   - Créez une redirection de www.votre-domaine.com vers votre-domaine.com

## Mise en place de l'environnement de production

### Configurer HTTPS

1. Dans le Manager Infomaniak, allez dans "Hébergement Web & Cloud" > Votre hébergement > "SSL/TLS"
2. Activez le certificat SSL gratuit Let's Encrypt

### Configurer les sauvegardes

1. Dans le Manager Infomaniak, allez dans "Hébergement Web & Cloud" > Votre hébergement > "Sauvegardes"
2. Configurez la fréquence des sauvegardes automatiques

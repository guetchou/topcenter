
# Tableau de bord de déploiement

TopCenter dispose d'un tableau de bord de déploiement intégré qui vous permet de gérer et surveiller vos déploiements en temps réel.

## Fonctionnalités du tableau de bord

- **Déploiement en un clic**: Lancez le processus de déploiement complet (sauvegarde, build, déploiement)
- **Sauvegarde indépendante**: Effectuez uniquement une sauvegarde sans déploiement
- **Logs en temps réel**: Suivez chaque étape du processus de déploiement
- **Monitoring du serveur**: Vérifiez l'état des services (Infomaniak, base de données, GitHub Actions)

## Accès au tableau de bord de déploiement

Le tableau de bord de déploiement est accessible à deux endroits:

1. Pour les administrateurs, via `/admin/deploy`
2. En accès direct via `/deploy` (nécessite une connexion)

## Utilisation du tableau de bord

### Déploiement manuel

Pour lancer un déploiement manuel:

1. Accédez au tableau de bord de déploiement
2. Cliquez sur le bouton "Déployer maintenant"
3. Confirmez l'action dans la boîte de dialogue
4. Suivez la progression en temps réel

### Création de sauvegardes

Pour créer une sauvegarde sans déploiement:

1. Accédez au tableau de bord de déploiement
2. Cliquez sur le bouton "Créer une sauvegarde"
3. Choisissez les éléments à sauvegarder (Base de données, Fichiers, Configuration)
4. Cliquez sur "Lancer la sauvegarde"

### Consultation des logs

Les logs de déploiement sont disponibles dans la section "Historique des déploiements" du tableau de bord. Vous pouvez:
- Voir les déploiements récents
- Consulter les détails d'un déploiement spécifique
- Télécharger les logs complets pour analyse

## Sécurité

Le tableau de bord est protégé et nécessite une connexion avec des droits d'administration. Toutes les actions sensibles sont enregistrées dans les logs système.

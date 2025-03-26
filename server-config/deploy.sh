
#!/bin/bash

# Script de déploiement automatique
# À exécuter sur le serveur après réception d'un webhook

# Configuration
LOG_FILE="../logs/deploy.log"
SITE_DIR="/home/clients/182ddf0dfc453b3faeaee042d1660720/sites"
BACKUP_DIR="/home/clients/182ddf0dfc453b3faeaee042d1660720/backups"
GITHUB_REPO="https://github.com/votre-organisation/topcenter.git"
BRANCH="main"

# Fonction de journalisation
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

# Début du déploiement
log "Début du déploiement automatique"

# Création du répertoire de sauvegarde avec horodatage
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_PATH="$BACKUP_DIR/backup_$TIMESTAMP"
mkdir -p "$BACKUP_PATH"

# Sauvegarde des fichiers actuels
log "Sauvegarde des fichiers actuels dans $BACKUP_PATH"
cp -r "$SITE_DIR"/* "$BACKUP_PATH/" 2>> "$LOG_FILE"

# Création d'un répertoire temporaire
TMP_DIR=$(mktemp -d)
log "Création du répertoire temporaire: $TMP_DIR"

# Clonage du dépôt GitHub
log "Clonage du dépôt GitHub: $GITHUB_REPO (branche: $BRANCH)"
git clone -b "$BRANCH" --single-branch "$GITHUB_REPO" "$TMP_DIR" 2>> "$LOG_FILE"

if [ $? -ne 0 ]; then
    log "ERREUR: Échec du clonage du dépôt"
    rm -rf "$TMP_DIR"
    exit 1
fi

# Entrer dans le répertoire du projet
cd "$TMP_DIR" || { log "ERREUR: Impossible d'accéder au répertoire $TMP_DIR"; exit 1; }

# Installation des dépendances npm
log "Installation des dépendances npm"
npm ci 2>> "$LOG_FILE"

if [ $? -ne 0 ]; then
    log "ERREUR: Échec de l'installation des dépendances"
    cd - > /dev/null
    rm -rf "$TMP_DIR"
    exit 1
fi

# Construction du projet
log "Construction du projet"
npm run build 2>> "$LOG_FILE"

if [ $? -ne 0 ]; then
    log "ERREUR: Échec de la construction du projet"
    cd - > /dev/null
    rm -rf "$TMP_DIR"
    exit 1
fi

# Déploiement des fichiers construits
log "Déploiement des fichiers vers $SITE_DIR"
rm -rf "$SITE_DIR"/* # Suppression des anciens fichiers
cp -r dist/* "$SITE_DIR/" # Copie des nouveaux fichiers

# Nettoyage
log "Nettoyage des fichiers temporaires"
cd - > /dev/null
rm -rf "$TMP_DIR"

# Fin du déploiement
log "Déploiement terminé avec succès!"

# Rotation des sauvegardes (garder seulement les 5 dernières)
log "Rotation des sauvegardes"
ls -1t "$BACKUP_DIR" | tail -n +6 | xargs -I {} rm -rf "$BACKUP_DIR/{}"

exit 0

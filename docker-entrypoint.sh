
#!/bin/sh
set -e

# Vérification de l'environnement
echo "Démarrage dans l'environnement: $NODE_ENV"

# Vérification des variables d'environnement requises
required_env_vars="VITE_SUPABASE_URL VITE_SUPABASE_ANON_KEY"

for var in $required_env_vars; do
  if [ -z "$(eval echo \$$var)" ]; then
    echo "Erreur: Variable d'environnement $var non définie"
    exit 1
  fi
done

# Préparation des répertoires de logs
mkdir -p /app/logs
echo "Répertoires de logs vérifiés"

# Génération d'un fichier de santé
cat > /app/public/healthcheck << EOF
OK
EOF

# Exécution de la commande
exec "$@"

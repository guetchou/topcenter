
# Stage de base 
FROM node:18-alpine AS base

# Installation des dépendances
FROM base AS deps
WORKDIR /app

# Copie des fichiers package.json
COPY package.json package-lock.json* ./
RUN npm ci

# Construction du frontend
FROM base AS frontend-builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Variables d'environnement pour le build
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_POCKETBASE_URL
ARG VITE_GITHUB_TOKEN
ARG VITE_INFOMANIAK_TOKEN
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_POCKETBASE_URL=$VITE_POCKETBASE_URL
ENV VITE_GITHUB_TOKEN=$VITE_GITHUB_TOKEN
ENV VITE_INFOMANIAK_TOKEN=$VITE_INFOMANIAK_TOKEN

# Construction de l'application frontend avec optimisation
RUN npm run build

# Configuration du backend
FROM base AS backend-builder
WORKDIR /app

# Copier les fichiers du backend
COPY ./backend/package.json ./backend/package-lock.json* ./
RUN npm ci --production
COPY ./backend ./

# Image finale
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Création d'un utilisateur non-root pour plus de sécurité
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 appuser

# Création des répertoires de logs et d'autres répertoires nécessaires
RUN mkdir -p /app/public /app/logs && chown -R appuser:nodejs /app

USER appuser

# Copie des fichiers frontend et backend
COPY --from=frontend-builder --chown=appuser:nodejs /app/dist /app/public
COPY --from=backend-builder --chown=appuser:nodejs /app/node_modules /app/node_modules
COPY --from=backend-builder --chown=appuser:nodejs /app/*.js /app/

# Installation de PM2 pour la gestion des processus
RUN npm install -g pm2

# Configuration et scripts de santé
COPY --from=backend-builder --chown=appuser:nodejs /app/ecosystem.config.js /app/

# Exposition des ports
EXPOSE 3000 
EXPOSE 4000

# Script de démarrage pour gérer les variables d'environnement
COPY --chown=appuser:nodejs docker-entrypoint.sh /app/
RUN chmod +x /app/docker-entrypoint.sh

# Script de vérification de santé
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 CMD wget --no-verbose --tries=1 --spider http://localhost:3000/healthcheck || exit 1

# Démarrage avec le script d'entrée
ENTRYPOINT ["/app/docker-entrypoint.sh"]

# Démarrage de l'application avec PM2
CMD ["pm2-runtime", "start", "ecosystem.config.js"]

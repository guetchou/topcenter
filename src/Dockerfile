
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
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_POCKETBASE_URL=$VITE_POCKETBASE_URL

# Construction de l'application frontend
RUN npm run build

# Configuration du backend
FROM base AS backend-builder
WORKDIR /app

# Copier les fichiers du backend
COPY ./backend/package.json ./backend/package-lock.json* ./
# Utiliser npm install au lieu de npm ci pour plus de tolérance aux erreurs
RUN npm install --production --no-package-lock
COPY ./backend ./

# Image finale
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Création d'un utilisateur non-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 appuser
USER appuser

# Copie des fichiers frontend et backend
COPY --from=frontend-builder /app/dist /app/public
COPY --from=backend-builder /app/node_modules /app/node_modules
COPY --from=backend-builder /app/*.js /app/

# Installation de PM2 pour la gestion des processus
RUN npm install -g pm2

# Exposition des ports
EXPOSE 3000 
EXPOSE 4000

# Démarrage de l'application avec PM2
CMD ["pm2-runtime", "start", "ecosystem.config.js"]

# ============================================
# 🎯 MULTI-STAGE BUILD
# ============================================

# ============================================
# 📦 STAGE 1: Development (com hot reload)
# ============================================
FROM node:20-alpine AS development

WORKDIR /app

# Copia package files
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia todo o código
COPY . .

# Expõe porta do Angular
EXPOSE 4200

# ✅ Comando com hot reload habilitado
CMD ["npm", "start", "--", "--host", "0.0.0.0", "--poll", "2000"]

# ============================================
# 🏗️ STAGE 2: Build (para produção)
# ============================================
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build -- --configuration production

# ============================================
# 🚀 STAGE 3: Production (Nginx)
# ============================================
FROM nginx:alpine AS production

COPY --from=build /app/dist/carona-certa-frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]


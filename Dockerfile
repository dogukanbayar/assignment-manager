# ---- build stage ----
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
# --ignore-scripts: container içinde husky/git hook kurulumu gerekmez
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build

# ---- runtime stage (root olmayan kullanıcı, 8080 portu) ----
FROM nginxinc/nginx-unprivileged:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:8080/ >/dev/null || exit 1

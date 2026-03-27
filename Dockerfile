FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
<<<<<<< Updated upstream

COPY . .
RUN npm run build


# Production stage
=======
COPY . .
RUN npm run build

>>>>>>> Stashed changes
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
<<<<<<< Updated upstream


=======
>>>>>>> Stashed changes
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

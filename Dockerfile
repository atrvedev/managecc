# => Build container
FROM node:18.7.0 as builder
WORKDIR /app
COPY . .
RUN npm install --legacy-peer-deps
RUN npm run build-docker

# => Run container
FROM nginx:alpine

# Nginx config
RUN rm -rf /etc/nginx/conf.d
COPY conf /etc/nginx

# Static build
COPY --from=builder /app/build /usr/share/nginx/html/

# Default port exposure
EXPOSE 80

# Copy .env file and shell script to container
WORKDIR /usr/share/nginx/html

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]

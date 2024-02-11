# The first FROM is now a stage called build-stage
FROM node:18 AS taivuttaja-build-stage
WORKDIR /usr/src/app
COPY . .
RUN npm ci
RUN npm run build

FROM nginx:1.20-alpine
COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html
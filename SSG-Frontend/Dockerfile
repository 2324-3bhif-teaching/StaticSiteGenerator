FROM node:latest as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build --configuration SSG-Frontend

FROM nginx:latest as production

COPY --from=build /app/dist/ssg-frontend /usr/share/nginx/html

RUN apt-get update && \
    apt-get install dos2unix && \
    apt-get clean

COPY nginx.conf /etc/nginx/conf.d/SSG.conf
RUN dos2unix /etc/nginx/conf.d/SSG.conf
RUN rm /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]

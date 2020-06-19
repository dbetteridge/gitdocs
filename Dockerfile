FROM node:lts

WORKDIR /app
COPY ./package*.json ./
RUN npm ci

EXPOSE 3000
RUN npm run build
CMD [ "npm", "run", "start" ]

COPY . .

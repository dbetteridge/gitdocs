FROM node:lts

WORKDIR /app
COPY ./package*.json ./
RUN npm ci

EXPOSE 3000
CMD [ "npm", "run", "dev" ]

COPY . .

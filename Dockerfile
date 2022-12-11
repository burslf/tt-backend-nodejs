FROM node:16-alpine3.15 

EXPOSE 3333


COPY package*.json /app/
WORKDIR /app
RUN npm install

COPY . /app
CMD ["npm", "run", "dev"]
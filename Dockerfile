FROM node:8

WORKDIR /app

COPY . /app

RUN yarn

EXPOSE 8080

CMD ["yarn", "start"]

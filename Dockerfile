# -------------
FROM node:16 AS BUILD

WORKDIR /usr/src

COPY package*.json ./
COPY decorate-angular-cli.js ./
COPY angular.json ./
COPY nx.json ./
COPY tsconfig.base.json ./

RUN npm install

COPY libs libs
RUN mkdir apps

COPY apps/frontend apps/frontend
RUN npm run ng build frontend -- --prod

COPY apps/api apps/api
RUN npm run ng build api -- --prod

# -------------
FROM node:16

# switch to europe timezone
RUN ln -fs /usr/share/zoneinfo/Europe/Paris /etc/localtime

WORKDIR /usr/src

COPY package*.json ./
COPY --from=BUILD /usr/src/dist dist/ 

RUN npm ci --only=production --ignore-scripts

ENV PORT=3000
ENV AUTHENT_JWT_SECRET=authent_jwt_secret
#ENV AUTHENT_GOOGLE_CLIENT_ID=

VOLUME ["/frontend"]
EXPOSE 3000

#CMD mv dist/apps/frontend/* dist/apps/frontend/.htaccess /frontend && node dist/apps/api/main.js
CMD mv dist/apps/frontend/* /frontend && node dist/apps/api/main.js
FROM node:10-alpine AS base
COPY client /portgen/client
COPY server /portgen/server
WORKDIR /portgen
RUN cd client && npm i && npm run build

FROM node:10-alpine 
WORKDIR /portgen
COPY server/index.js /portgen/index.js
COPY server/package.json /portgen/package.json
COPY --from=base /portgen/client/dist ./public
RUN npm i

CMD ["/usr/local/bin/node", "/portgen/index.js"]
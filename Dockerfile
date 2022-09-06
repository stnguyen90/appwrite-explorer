FROM node:16 as builder

RUN mkdir /app
WORKDIR /app
COPY package.json /app
RUN npm install --force
COPY . /app
RUN npm run build


FROM nginx:alpine

COPY --from=builder /app/build /usr/share/nginx/html

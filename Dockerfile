FROM --platform=$BUILDPLATFORM node:20 as builder

RUN mkdir /app
WORKDIR /app
COPY package.json /app
RUN npm install --force
COPY . /app
RUN npm run build


FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

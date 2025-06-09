FROM node:22 AS build

COPY . /app
WORKDIR /app

ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
ARG VITE_QUESTION_ANSWER_TIME
ENV VITE_QUESTION_ANSWER_TIME=${VITE_QUESTION_ANSWER_TIME}
ARG VITE_QUESTION_RESULT_TIME
ENV VITE_QUESTION_RESULT_TIME=${VITE_QUESTION_RESULT_TIME}
ARG VITE_QUIZ_OVERRIDE
ENV VITE_QUIZ_OVERRIDE=${VITE_QUIZ_OVERRIDE}
RUN corepack enable
RUN yarn install
RUN yarn build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
RUN mkdir -p /etc/nginx/conf.d && \
    cat > /etc/nginx/conf.d/default.conf <<EOF
server {
  listen 80;
  server_name localhost;

  location / {
    root /usr/share/nginx/html;
    try_files \$uri \$uri/ /index.html;
  }
}
EOF

EXPOSE 80
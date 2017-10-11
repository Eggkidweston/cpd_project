FROM node:8.4.0

ARG API_ROOT
ARG CURATION_ROOT
ARG S3_ROOT
ARG IDP_MEMBERS

ENV API_ROOT       ${API_ROOT}
ENV CURATION_ROOT  ${CURATION_ROOT}
ENV S3_ROOT        ${S3_ROOT}
ENV IDP_MEMBERS    ${IDP_MEMBERS}

WORKDIR /app

COPY . /app

RUN apt-get update

RUN apt-get install -y nginx

RUN npm install webpack -g

RUN npm install

RUN webpack

RUN cp /app/nginx/store-front.conf /etc/nginx/sites-available/store-front.conf

RUN ln -s /etc/nginx/sites-available/store-front.conf /etc/nginx/sites-enabled/store-front.conf

RUN rm /etc/nginx/sites-enabled/default

RUN rm /etc/nginx/sites-available/default

RUN rm /var/www/html/index.nginx-debian.html

RUN cp -r /app/build/* /var/www/html/

EXPOSE 80

# Forward request and error logs to docker log collector
RUN ln -sf /dev/stdout /var/log/nginx/access.log
RUN ln -sf /dev/stderr /var/log/nginx/error.log

CMD ["nginx", "-g", "daemon off;"]

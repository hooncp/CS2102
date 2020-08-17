FROM postgres:latest
COPY . /docker-entrypoint-initdb.d/
COPY . .

ENV POSTGRES_USER postgres
ENV POSTGRES_PASSWORD password
ENV POSTGRES_DB project
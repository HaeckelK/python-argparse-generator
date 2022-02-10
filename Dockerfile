FROM node:17-alpine

WORKDIR /usr
COPY . .
WORKDIR /usr/python-argparse-generator
RUN npm install
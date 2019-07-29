FROM node:latest
RUN mkdir -p /home/www
WORKDIR /home/www
COPY . /home/www/
RUN npm install
RUN npm audit fix
RUN npm run build
EXPOSE 3000
ENTRYPOINT ["npm", "run"]
CMD ["/bin/bash","npm", "run"]

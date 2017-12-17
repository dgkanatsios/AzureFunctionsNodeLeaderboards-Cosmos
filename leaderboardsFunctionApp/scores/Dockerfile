FROM mhart/alpine-node:8.9.1
ENV AZURE_FUNCTIONS_RUNTIME=false NODE_ENV=production
RUN mkdir -p /app
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
EXPOSE 3000
CMD ["node","index"]
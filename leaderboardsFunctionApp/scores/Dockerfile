FROM mhart/alpine-node:8.9.3

ENV AZURE_FUNCTIONS_RUNTIME false
ENV NODE_ENV production

RUN addgroup -S appuser && adduser -S -g appuser appuser 
ENV HOME=/home/appuser
USER appuser

RUN mkdir $HOME/leaderboards
WORKDIR $HOME/leaderboards

COPY package.json $HOME/leaderboards

RUN npm install

COPY . $HOME/leaderboards

EXPOSE 3000

CMD ["node","index"]
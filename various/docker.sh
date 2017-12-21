docker build -t dgkanatsios/azurefunctionsnodeleaderboards:0.1 .
docker push dgkanatsios/azurefunctionsnodeleaderboards:0.1
docker run -d -p 3000:3000 -e "MONGODB_CONNECTION_STRING=mongodb://node-scores:12345678@node-scores.documents.azure.com:10255/?ssl=true&replicaSet=globaldb" --name leaderboardsapi dgkanatsios/azurefunctionsnodeleaderboards:0.1 
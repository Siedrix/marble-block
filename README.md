Steps to create a proyect with Marble Block

* Clone repo.
* Remove git folder
* Make a conf folder
* Add dev and production conf based on conf-example.json
* Run npm install

__Presto Run server.__

For development run 

    supervisor --debug -- server.js 

Server.js options

* env: to run as production enviroment

    supervisor --debug -- server.js --env production


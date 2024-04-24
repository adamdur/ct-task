# How to run the services

## Development
For development mode, **docker-compose.dev.yml** is prepared with services needed for development.

### Prepare services
Install npm packages:\
```shell
cd api-service && npm install
```
```shell
cd rating-service && npm install
```

### Build and up docker
You can use the prepared script `up-build.sh`:\
```shell
sh ./up-build.sh docker-compose.dev.yml
```

### Run services:
```shell
cd api-service && npm run start:dev
```
```shell
cd rating-service && npm run start:dev
```
> Note: .env files are committed and prepared for use with services setup in docker-compose.dev.yml. Feel free to adjust the .env files if needed.

You can access the api-service on port 3000.

### Seed database:
Additionally, you can seed the database with the dummy data:
```shell
cd api-service && npm run seed
```

### Common library
For common library adjustments, you can link the library to services package.json locally: 
```json
"ct-common-lib": "file:../ct-common-lib"
```
After changes, run `npm run build` in **ct-common-lib** and `npm install` in service (**api-service** or **rating-service**).

## Production
For "production" mode, **docker-compose.yml** is prepared to build all services together.

### Build and up docker
You can use the prepared script `up-build.sh`:\
```shell
sh ./up-build.sh
```
All services should be app and running. Api-service will be exposed at port 3000.

### Seed database:
Additionally, you can seed the database with the dummy data. Script is prepared to seed the database inside docker.
```shell
sh ./seed.sh
```

### Stop container
Use prepared script to stop the container:
```shell
sh ./down.sh
```


## Additional information
For additional information please refer to **docs** folder.

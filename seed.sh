#!/bin/bash

container_name="cloudtalk-task"

if [ "$#" -eq 1 ]; then
    compose_file=$1
fi

container_name=$1

docker-compose -p "$container_name" -f docker-compose.yml exec api-service node ./dist/scripts/seed.js


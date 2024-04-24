#!/bin/bash

# Dont forget to run chmod
# chmod +x up-build.sh

compose_file="docker-compose.yml"

if [ "$#" -eq 1 ]; then
    compose_file=$1
fi

docker-compose -p cloudtalk-task -f $compose_file up -d --build --force-recreate

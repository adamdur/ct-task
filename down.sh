#!/bin/bash

# Initialize flag for checking if volumes should be removed
remove_volumes=false

for arg in "$@"
do
  if [[ "$arg" == "--volumes" ]]; then
    remove_volumes=true
  fi
done

if $remove_volumes; then
    echo "Removing containers and volumes..."
    docker-compose -p cloudtalk-task down --volumes
else
    echo "Removing containers only..."
    docker-compose -p cloudtalk-task down
fi

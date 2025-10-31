#!/bin/bash

#################################################################
# Faz o deploy do site no servidor. Cria o container docker,    # 
# envia para o repositório, se conecta no servidor e atualiza   #
# o container no servidor                                       #
#                                                               #
# Data: 24/01/2025                                              #
# Autor: Rafael Cunha                                           #
#                                                               #
# Modo de usar: ./<script> <path_to_dockerfile>                 #
#################################################################

AWS_KEY=$(dirname $0)/keys/aid-server.pem
SERVER_ADDR=aid.ia.br
SERVER_USER=ubuntu
CONTAINER_NAME=rafaelnascunha/aid
CONTAINER_TAG=1.0
COMPOSE_FILE=$(dirname $0)/compose.yml

help() {
  echo "Como usar:"
  echo " ./$(basename $0) <path-to-root-directory>"
}

######################################################
# Checking inputs                                    #
######################################################

echo $AWS_KEY

if [ ! -f "$AWS_KEY" ]; then
  echo "ERROR! AWS Key not found";
  exit 1;
fi

echo "Found AWS key";

if [ $# -ne 1 ]; then 
  echo "Wrong number of arguments";
  help
  exit 2
fi

if [ ! -d $1 ]; then 
  echo "ERROR! '$1' is not a directory!";
  help
  exit 3
fi

if [ ! -f "$1/Dockerfile" ]; then 
  echo "ERROR! '$1' is not the root directory of the project!";
  help
  exit 4
fi

command -v docker >&- 2>&-
if [ $? -ne 0 ]; then 
  echo "ERROR! 'docker' not installed!";
  exit 5
fi

######################################################
# Main                                               #
######################################################

echo "Bulding container..."
docker build -t $CONTAINER_NAME:$CONTAINER_TAG .

if [ $? -ne 0 ]; then
  echo "Error building container! Exiting!";
  exit 6;
fi

echo "Pushing container to server..."
docker push $CONTAINER_NAME:$CONTAINER_TAG

if [ $? -ne 0 ]; then
  echo "Error pushing container to server! Exiting!";
  exit 7;
fi

# echo "Updating server..."
ssh -l $SERVER_USER -i $AWS_KEY $SERVER_ADDR "sudo sh -c 'echo \"$(cat $COMPOSE_FILE)\" > compose.yml; docker compose pull && docker compose up -d'"

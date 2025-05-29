PWD := $(shell pwd)

FILE="docker-compose.yml"

all: dev

up: dev

dev:
	npm install --prefix apollo --legacy-peer-deps
	npm install --prefix backend
	docker compose up --build --detach

backend:
	npm install --prefix backend
	docker compose up --build --detach backend

database:
	cd database && npm install && npm run start

kill:
	docker compose kill

stop:
	docker compose stop

down: stop
	docker compose down

clean: down
	-docker rmi -f $$(docker images "workflow-studio-management*" | awk 'NR!=1 {print}' | awk '{print $$1}')

fclean: clean
	-sudo rm -rf apollo/dist
	-sudo rm -rf apollo/.angular
	-sudo rm -rf apollo/node_modules
	-sudo rm -rf backend/data
	-sudo rm -rf backend/dist
	-sudo rm -rf backend/node_modules
	-sudo rm -rf database/data
	-sudo rm -rf database/node_modules

re: clean dev

.PHONY: all up dev backend database kill stop down clean re

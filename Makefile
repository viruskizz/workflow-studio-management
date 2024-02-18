
PWD := $(shell pwd)

DEV_FILE="docker-compose.dev.yml"
PROD_FILE="docker-compose.yml"

all: prod

prod:
	docker compose up --build --detach

dev:
	npm install --prefix frontend
	npm install --prefix backend
	docker compose --file ${DEV_FILE} up --build --detach

dev-backend:
	npm install --prefix backend
	docker compose \
		--file ${DEV_FILE} \
		run \
		--build \
		--rm \
		--detach \
		-v .env:/usr/src/app/.env \
        -v ./backend:/usr/src/app \
		-p 3000:3000 \
		-p 9229:9229 \
		backend

seed-database:
	cd database && npm install && npm run start

re: clean prod

re-dev: clean dev

kill:
	docker compose kill

stop:
	docker compose stop

down: stop
	docker compose down

clean: down
	-docker rmi -f $$(docker images "workflow-studio-management*" | awk 'NR!=1 {print}' | awk '{print $$1}')

fclean: clean
	-sudo rm -rf backend/node_modules
	-sudo rm -rf database/node_modules
	-sudo rm -rf frontend/node_modules
	-sudo rm -rf backend/data
	-sudo rm -rf database/data

.PHONY: prod dev dev-frontend dev-backend dev-kill run-backend re-backend run-frontend all stop down re clean

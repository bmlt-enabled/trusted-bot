.PHONY: run run-as-discord build clean

build:
	docker-compose build

clean:
	docker rmi -f trusted-bot_trustedbot

run: # https://github.com/docker/compose/issues/1259
	docker-compose run -e INSPECT=true -e ADAPTER=shell -e HUBOT_NAME=trusted-bot --service-ports trustedbot

run-as-discord:
	# run as test bot "trusted-bot", turn debugger on by default
	docker-compose run -e INSPECT=true -e ADAPTER=discord -e HUBOT_NAME=trusted-bot-labs --service-ports trustedbot

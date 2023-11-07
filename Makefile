MAKEFLAGS = --no-print-directory --always-make --silent
MAKE = make $(MAKEFLAGS)

dev:
	@echo "Booting up dev..."
	npm run start

deploy:
	@echo "Deploying to github pages..."
	npm run deploy

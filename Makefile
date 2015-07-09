all: build
	@echo -e "\x1b[1;32m=== Build succeeded! ===\x1b[m"
	@echo -e "\x1b[32mYou may now continue with one of the following commands:\x1b[m"
	@echo -e "\x1b[90m - \x1b[96mmake build\x1b[0;90m - (re)build the dist (client-side) files\x1b[m"
	@echo -e "\x1b[90m - \x1b[96mmake start\x1b[0;90m (or \x1b[36mmake run\x1b[0;90m)\x1b[32m - build the dist files, and start a server\x1b[m"
	@echo -e "\x1b[90m - \x1b[96mmake devel\x1b[0;90m (or \x1b[36mmake watch\x1b[0;90m)\x1b[32m - build, start a server, and watch source files (rebuilding when they change)\x1b[m"


node_modules: package.json
	npm install
	npm install bower grunt-cli
	touch node_modules

src/vendor: bower.json
	./node_modules/.bin/bower install
	touch src/vendor


deps: node_modules src/vendor

build: deps
	./node_modules/.bin/grunt build

run: build
	./node_modules/.bin/grunt connect:server:keepalive
start: run

devel: deps
	./node_modules/.bin/grunt devel
watch: devel

.PHONY: all deps build run start devel watch

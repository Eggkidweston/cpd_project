install:
	npm install

run: 
    npm run go
    
dev:
	./node_modules/.bin/webpack-dev-server

test:
	karma start

tree:
	cd .. && tree -I node_modules -A -F angular2-rxjs-chat
 
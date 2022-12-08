# Emoji Finder

## Building
```
npm install
npm run build
```
Then open `index.html` in a browser.

## config.json file
- `log` - Enables logging
	- `url` - Contains different URLs
		- `emoji` - A URL to Emoji JSON data file

## NPM scripts
- `sass` - Compiles SASS styles
- `sass:watch` - Watches stylesheets and recompiles them when they change
- `webpack` - Compiles TypeScript
- `webpack:watch` - Watches TypeScript in devmode and recompiles them when they change
- `webpack:dev` - Compiles TypeScript in devmode
- `build` - Builds the entire project (runs all previous scripts)
- `build:dev` - Builds the entire project in devmode (runs all previous scripts)
- `make:emoji` - Generates emoji data
- `server` - Runs local server at `localhost:80`

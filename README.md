# Emoji Finder
Simple emoji finder app
![](asset/finder.png)

## Building
```
npm install
npm run make:emoji
npm run server
npm run build
```
Then open `localhost:80` in a browser.

## Directory structure
- `cli/` - Node.js scripts
- `src/` - TypeScript source code
	- `error/` - Error classes
	- `view/` - React components
	- `worker/` - Web workers
	- `global.d.ts` - Global typings
- `config.json` - The main app configuration file
- `index.html` - HTML entry point
- `index.scss` - SCSS entry point
- `index.ts` - TypeScript entry point

## config.json file
- `log` - Enables logging
- `pagination` - How many emoji items to show at once
	- `ui` - User interface settings
		- `gap` - Gap size of layout items in Bootstrap sizes
	- `url` - Contains different URLs
		- `emoji` - A URL to Emoji JSON data file

## NPM scripts
- `clean` - Cleans the directory from compiled files
- `sass` - Compiles SASS styles
- `sass:watch` - Watches stylesheets and recompiles them when they change
- `ts` - Compiles TypeScript
- `ts:watch` - Watches TypeScript in devmode and recompiles them when they change
- `ts:dev` - Compiles TypeScript in devmode
- `ts:check` - Checks source code for compilation errors without building the project
- `ts:prune` - Finds TypeScript dead code
- `build` - Builds the entire project (runs all previous scripts)
- `build:dev` - Builds the entire project in devmode (runs all previous scripts)
- `make:emoji` - Generates emoji data
- `server` - Runs local server at `localhost:80`
- `test` - Runs tests

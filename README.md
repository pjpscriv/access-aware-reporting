# Access Aware Reporting
Program for visualising data from the [Access Aware](https://www.accessaware.co.nz/) app by CCS Disability Action and Safer.me (formerly ThunderMaps). Built with the assistance of the [API Examples](https://github.com/cloud-source/thundermaps-api-example).

## API Key
Find your key in [Channel Manager](https://www.accessaware.co.nz/#!/channel-manager) > Integrations > Thunder Bot and save it into `api-key.txt`.

## Dependencies
This program uses the [node.js](https://nodejs.org/dist/v10.16.0/) runtime, a [mongoDB](https://www.mongodb.com/download-center/community) database and the following node libraries:
 - request - http library
 - sha1 - hash library
 - express - a web framework
 - mongodb - database library
 - plotly - graphing library
 - staticmaps - a library to generate map images
 - mustache & mustache-express - http templating libary and it's express implementation

## Installation
Install node dependencies with
```bash
$ npm install
```

## Running
Make sure mongo database is running:
```bash
$ mongod
```

Ppull the latest reports with:
```bash
$ node ./src/data-puller/loader.js
```

Then generate reports with:
```bash
$ node ./src/emails.js
```

## Testing
Tested with node 10.16.0 and mongo 4.0.10 on Windows 10 and Linux Mint.


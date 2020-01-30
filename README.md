# Access Aware Reporting
Program for visualising data from the [Access Aware](https://www.accessaware.co.nz/) app by CCS Disability Action and Safer.me (formerly ThunderMaps). Built with the assistance of the [API Examples](https://github.com/cloud-source/thundermaps-api-example) and [API Docs](https://github.com/formigarafa/thundermaps-api-docs).

## API Key
Find your key in [Channel Manager](https://www.accessaware.co.nz/#!/channel-manager) > Integrations > Thunder Bot and save it into `api-key.txt`.

## Dependencies
This program uses the node.js runtime ([download here](https://nodejs.org/dist/v10.16.0/)) and a mongoDB database ([download here](https://www.mongodb.com/download-center/community)).

## Installation
Install node dependencies with
```bash
$ npm install
```
The dependencies are:
 - request - http library
 - sha1 - hash library
 - express - a web framework
 - mongodb - database library
 - plotly - graphing library
 - staticmaps - a library to generate map images
 - mustache & mustache-express - http templating libary and it's express implementation

## Running
Start the mongo database:
```bash
$ mongod
```

Pull the latest reports with:
```bash
$ node ./src/data-puller/loader.js
```

Then generate reports with:
```bash
$ node ./src/emails.js
```

They will be created in a folder called `generated`.

## Testing
Tested with node 10.16.0 and mongo 4.0.10 on Windows 10 and Linux Mint.


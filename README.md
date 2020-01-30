# Access Aware Reporting
Program for visualising data from the [Access Aware](https://www.accessaware.co.nz/) app by CCS Disability Action and Safer.me (formerly ThunderMaps). Built with the assistance of the [API Examples](https://github.com/cloud-source/thundermaps-api-example) and [API Docs](https://github.com/formigarafa/thundermaps-api-docs).

To run this program you must have an Access Aware account and use the API Key associated with that account. An account can be created [here](https://accessaware.co.nz/).

## Dependencies
This program uses the node.js runtime ([download here](https://nodejs.org/dist/v10.16.0/)) and a mongoDB database ([download here](https://www.mongodb.com/download-center/community)).

## Installation
If you do not have node.js and mongoDB installed, install them using the links above.

Then install node dependencies with
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

## API Key
Find your key in [Channel Manager](https://www.accessaware.co.nz/#!/channel-manager) > Integrations > Thunder Bot and save it into `api-key.txt`.

## Running
Start the mongo database:
```bash
$ mongod
```
You may need to create a database folder and specify it when you run:
```bash
$ mkdir -p data/db
$ mongod --dbpath=./data/db
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


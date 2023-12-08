# VR dashboard server application

This server is used to record and retrieve Vr data from various Virtual Reality applications and support for [VR Dashboard app](https://github.com/rehacekleos/vr_dashboard_fe).<br>
The server supports multi-organization.

The server application is written in Node.js using typescript and express.js.<br>
MongoDb version 6.0 is used as the database.

## Application Structure in /src directory

#### `/app` Application logic
#### `/bootstrap` Defining different types of server
#### `/configs` Setting env variables and all global variables
#### `/server` Express.js server settings
#### `/shared` Global files such as models, enums, repositories, controllers, middlewares, etc.

## First run on local machine

### Prerequisites

- MongoDB database with minimal 6 version
- Installed Node.js (minimal v18) and npm
  - How to install Node.js: [How to install Node.js](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs).
  - npm is installed together with Node.js
  - Check if Node.js and npm is installed?
    - Run `node -v`
    - Run `npm -v`

### Run application

To run the application on the local machine for the first time, you need to do the following:

1. Run `npm install`
2. Create an .env file in the project root folder.
3. Define the following env in the .env file
   - DB_URL
   - MONGO_DB_DATABASE
4. Run the application using `npm run dev`

After that, the application should be available at [http://localhost:8000](http://localhost:8000).<br> If you try opening the following address in a browser, you should see the Swagger documentation.

You can find out if the application is connected to the DB by using the address: [http://localhost:8000/health-check](http://localhost:8000/health-check) where you should see message: `vr_dashboard_be is running on version: $app_version`.


## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode. \
Open [http://localhost:8000/health-check](http://localhost:8000/health-check) to view it in the browser if server is running well.

### `npm run build`

Builds the app for production to the `/build` folder.

### `npm run generate:docs`

Builds the docs to the `/docs` folder.

### `npm run zip:deploy`

Builds the app for production and zip it into `deploy-code.zip`.

## Swagger

Api swagger is available on route: `/api/docs`

## JsDoc

Js docs are available on route: /docs

## Environmental variables

Environment variables are defined in the `/src/configs` folder

* APP_MODE: Define in which mode application is running.
    * __REQUIRED__
    * VALUES: `LOCALHOST`, `PRODUCTION`
* SERVER_TYPE: defines the server type
    * DEFAULT: `DEFAULT`
* PORT: Port on which the application listens.
    * DEFAULT: `8080`
* WORKERS: Number of running worker threads.
    * DEFAULT: `1`
* DB_URL: Connection string to mongoDb database.
    * __REQUIRED__
    * FORMAT: `mongodb+srv://user:password@host`
* MONGO_DB_TYPE: MongoDb database type.
    * DEFAULT: `MONGODB`
* MONGO_DB_DATABASE: Name of the mongoDb database.
    * __REQUIRED__
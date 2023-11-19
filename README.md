# VR dashboard server

This server is used to record and retrieve Vr data from various applications. The server supports multi-organization.

## Application Structure

#### `/app` Application logic
#### `/bootstrap` Defining different types of server
#### `/configs` Setting env variables and all global variables
#### `/server` Express.js server settings
#### `/shared` Global files such as models, enums, repositories, controllers, middlewares, etc.

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode. \
Open [http://localhost:8000/health-check](http://localhost:8000/health-check) to view it in the browser if server is running well.

### `npm run build`

Builds the app for production to the `/build` folder.

### `npm run generate:docs`

Builds the docs to the `/docs` folder.

## Swagger

Api swagger is available on route: `/api/docs`

## Environmental variables

Environment variables are defined in the `/configs` folder

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
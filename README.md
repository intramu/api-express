# Intramu Back-end API

This is the back-end server that runs intramu. It communicates with the front-end and exposes a set of service endpoints for maintenance

The API can be accessed at rest.intramu.com/...

## GitHub

Repo: https://github.com/intramu/api-express

## Authors

-   [@noahr1936](https://github.com/noahr1936)

## API Reference

API docs can be found at this Swagger Link: https://app.swaggerhub.com/organizations/Intramu

There is both a

-   service-API
-   user-API

## Run Locally

Clone the project

```bash
  git clone https://github.com/intramu/api-express.git
```

Go to the project directory

```bash
  cd api-express
```

Install dependencies

```bash
  npm install
```

The API interacts with a PostgreSQL database for storing and retrieving data

Either

-   Connect to a local instance
-   Or connect to a cloud instance

The connection settings can be changed in the database.ts file

```javascript
export const db = new Pool({
    user: "",
    host: "",
    database: "",
    password: "",
    port: 5432,
});
// Change to your specifications
```

Create database

Using the ddlPostgres.txt file execute the create table commands until the database is finished.

Start the server

```bash
  npm run start
```

// Update with your config settings.
require("dotenv").config(".env");
module.exports = {
  development: {
    client: "postgresql",
    connection: {
      host: process.env.PG_HOSTNAME,
      database: process.env.PG_DB,
      user: process.env.PG_USERNAME,
      password: process.env.PG_PASSWORD,
      port: process.env.PG_PORT,
    },
    pool: {
      min: 2,
      max: 20,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },

  production: {
    client: "postgresql",
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};

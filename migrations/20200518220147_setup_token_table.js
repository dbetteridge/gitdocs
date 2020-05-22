/**
 * TOKEN
 * id - bigint
 * type - string
 * org - string
 * access_token - string
 * refresh_token - string
 * expiry_time - number
 * scopes - string
 * owner - USER
 * space - SPACE
 * created - timestamp
 */
exports.up = function (knex) {
  return knex.schema.createTable("tokens", (table) => {
    table.increments("id").primary();
    table.string("type").notNullable(); // github, azure etc
    table.string("org").notNullable();
    table.string("access_token").notNullable();
    table.string("refresh_token");
    table.string("token_type");
    table.integer("expiry_time");
    table.string("scopes");
    table.string("owner").notNullable();
    table.foreign("owner").references("users.email");
    table.string("space").notNullable();
    table.foreign("space").references("spaces.id");
    table.timestamp("created").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("tokens");
};

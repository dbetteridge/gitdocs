/**
 * USER_SPACE
 * id - bigint
 * user
 * space
 */
exports.up = function (knex) {
  return knex.schema.createTable("user_space", (table) => {
    table.increments("id").primary();
    table.string("user").notNullable();
    table.foreign("user").references("users.email");
    table.string("space").notNullable();
    table.foreign("space").references("spaces.id");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("user_space");
};

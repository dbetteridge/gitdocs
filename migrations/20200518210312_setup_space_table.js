/**
 * SPACE
 * id - string
 * owner - USER
 * created - timestamp
 * paidSpace - boolean
 * active - boolean
 */
exports.up = function (knex) {
  return knex.schema.createTable("spaces", (table) => {
    table.string("id").unique().primary();
    table.string("owner").notNullable();
    table.foreign("owner").references("users.email");
    table.timestamp("created").defaultTo(knex.fn.now());
    table.boolean("paidSpace").defaultTo(false);
    table.boolean("active").defaultTo(true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("spaces");
};

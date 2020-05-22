/**
 * DOC
 * id - bigint
 * source - doc url
 * owner - SPACE
 * created - timestamp
 * markdown - string
 * html - string
 */
exports.up = function (knex) {
  return knex.schema.createTable("docs", (table) => {
    table.increments("id").primary();
    table.string("source").notNullable();
    table.string("owner").notNullable();
    table.foreign("owner").references("spaces.id");
    table.timestamp("created").defaultTo(knex.fn.now());
    table.string("markdown").notNullable();
    table.string("html").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("docs");
};

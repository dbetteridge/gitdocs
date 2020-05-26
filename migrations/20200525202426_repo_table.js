exports.up = function (knex) {
  return knex.schema.createTable("repos", (table) => {
    table.increments("id").primary();
    table.string("url").notNullable();
    table.string("owner").notNullable();
    table.foreign("owner").references("spaces.id");
    table.integer("token");
    table.foreign("token").references("tokens.id");
    table.timestamp("created").defaultTo(knex.fn.now());
    table.boolean("isProcessed").defaultTo(false);
    table.timestamp("lastUpdated").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("repos");
};

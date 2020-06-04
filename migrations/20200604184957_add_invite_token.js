exports.up = function (knex) {
  return Promise.all([
    knex.raw(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`),
    knex.schema.createTable("invites", (table) => {
      table.increments("id");
      table.string("space");
      table.string("user");
      table.uuid("invite_token").defaultTo(knex.raw("uuid_generate_v4()"));
    }),
  ]);
};

exports.down = function (knex) {
  return knex.schema.dropTable("invites");
};

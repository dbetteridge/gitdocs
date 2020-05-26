exports.up = function (knex) {
  return knex.schema.alterTable("repos", (table) => {
    table.string("type").notNullable();
    table.string("org").notNullable();
    table.string("project");
    table.string("repo").notNullable();
  });
};

exports.down = function (knex) {
  return knex.raw(`ALTER TABLE repos DROP COLUMN type;
    ALTER TABLE repos DROP COLUMN org;
    ALTER TABLE repos DROP COLUMN project;`);
};

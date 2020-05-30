exports.up = function (knex) {
  return knex.raw(`ALTER TABLE docs ADD COLUMN name text;
  ALTER TABLE docs ADD COLUMN path text;`);
};

exports.down = function (knex) {};

exports.up = function (knex) {
  return knex.raw(`ALTER TABLE docs DROP COLUMN html;
  ALTER TABLE docs DROP COLUMN markdown;
  ALTER TABLE docs ADD COLUMN html text;
  ALTER TABLE docs ADD COLUMN markdown text;
  `);
};

exports.down = function (knex) {};

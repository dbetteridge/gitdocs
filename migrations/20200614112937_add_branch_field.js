exports.up = function (knex) {
  return knex.raw(`ALTER TABLE repos ADD COLUMN branch text;`);
};

exports.down = function (knex) {};

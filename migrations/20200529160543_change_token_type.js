exports.up = function (knex) {
  return knex.raw(`ALTER TABLE tokens DROP COLUMN access_token;
  ALTER TABLE tokens ADD COLUMN access_token text;
  ALTER TABLE tokens DROP COLUMN refresh_token;
  ALTER TABLE tokens ADD COLUMN refresh_token text;`);
};

exports.down = function (knex) {
  return knex.raw(`ALTER TABLE tokens DROP COLUMN access_token;
  ALTER TABLE tokens ADD COLUMN access_token varchar;`);
};

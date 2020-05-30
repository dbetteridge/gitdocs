exports.up = function (knex) {
  return knex.raw(`ALTER TABLE tokens DROP COLUMN access_token;
  ALTER TABLE tokens ADD COLUMN access_token text;
  ALTER TABLE tokens DROP COLUMN refresh_token;
  ALTER TABLE tokens ADD COLUMN refresh_token text;
  ALTER TABLE tokens ADD CONSTRAINT unique_token UNIQUE (type, org, owner, space);
  `);
};

exports.down = function (knex) {
  return knex.raw(`ALTER TABLE tokens DROP COLUMN access_token;
  ALTER TABLE tokens ADD COLUMN access_token varchar;
  ALTER TABLE tokens DROP CONSTRAINT unique_token;
  `);
};

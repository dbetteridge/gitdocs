exports.up = function (knex) {
  return knex.raw(
    `ALTER TABLE user_space ADD CONSTRAINT user_space_unique UNIQUE ("space","user");`
  );
};

exports.down = function (knex) {};

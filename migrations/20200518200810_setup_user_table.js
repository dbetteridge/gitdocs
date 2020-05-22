/**
 * USER
 * id
 * name
 * email
 * passwordHash
 * lastLogin
 * created
 */
exports.up = function (knex) {
  return Promise.all([
    knex.raw(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`),
    knex.schema
      .createTable("users", (table) => {
        table.string("name").notNullable();
        table.string("email").unique().notNullable().primary();
        table.string("hash").notNullable();
        table.timestamp("lastLogin").defaultTo(knex.fn.now());
        table.timestamp("created").defaultTo(knex.fn.now());
      })
      .then((table) => table)
      .catch((err) => console.error(err)),
    knex.raw(`
          CREATE OR REPLACE FUNCTION register(text, text, text) RETURNS json
          AS $$
            INSERT INTO users(name, email,hash) VALUES ($1, $2, (SELECT hash.crypt FROM (SELECT crypt($3, gen_salt('bf',10))) as hash)) RETURNING row_to_json(users.*);
          $$
          LANGUAGE SQL
          VOLATILE;`),
    knex.raw(`
          CREATE OR REPLACE FUNCTION login(text, text) RETURNS json AS $result$
          declare result json;
          declare userID text;
          BEGIN
            SELECT email into userID FROM users WHERE email = $1 AND hash = (SELECT calc_hash.crypt FROM (SELECT crypt($2, hash)) as calc_hash);
            IF userID IS NOT NULL THEN
              UPDATE users SET ("lastLogin")=(SELECT NOW()) WHERE email = $1;
              SELECT to_json(sub) into result FROM (SELECT name, email, "lastLogin"::timestamptz,created::timestamptz FROM users WHERE email = userID::text) AS sub;
              RETURN result;
            END IF;
            RETURN NULL;
          END;
          $result$ LANGUAGE plpgsql;
          `),
  ]);
};

exports.down = function (knex) {
  return knex.schema.dropTable("users");
};

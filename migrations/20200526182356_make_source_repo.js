exports.up = function (knex) {
  return knex.raw(`ALTER TABLE docs DROP COLUMN source;
  ALTER TABLE docs ADD COLUMN source integer;
  ALTER TABLE docs ADD CONSTRAINT fk_doc_repo FOREIGN KEY (source) REFERENCES repos (id);`);
};

exports.down = function (knex) {};

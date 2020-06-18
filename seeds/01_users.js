exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex.migrate.latest();
  await knex("user_space").del();

  await knex("docs").del();
  await knex("repos").del();
  await knex("tokens").del();
  await knex("spaces").del();
  return knex("users")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex.raw(
        `SELECT register('Daniel Betteridge','danielrbetteridge@gmail.com','testpassword');`
      );
    });
};

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("spaces")
    .del()
    .then(function () {
      // Inserts seed entries
      return Promise.all([
        knex("spaces").insert([
          { id: "daniel", owner: "danielrbetteridge@gmail.com" },
        ]),
        knex("user_space").insert([
          { user: "danielrbetteridge@gmail.com", space: "daniel" },
        ]),
      ]);
    });
};

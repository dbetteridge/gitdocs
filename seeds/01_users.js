exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("user_space").del();
  return knex("users")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("users").insert([
        {
          name: "Daniel Betteridge",
          email: "danielrbetteridge@gmail.com",
          hash: "$2a$10$VCt1xcTtAng8GFpkp0Lii./9JVmV0Sln2A9onFRvN4rJixZmj2zGi",
        },
      ]);
    });
};

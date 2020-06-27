require("dotenv").config();
const loadtest = require("loadtest");
const { createValidJWT } = require("../utils/front-helpers");
const token = createValidJWT(
  { email: "danielrbetteridge@gmail.com" },
  process.env.SECRET
);
console.log(token);
it("Load tests the Repos API", async () => {
  const results = new Promise((ok, fail) => {
    loadtest.loadTest(
      {
        insecure: true,
        url: "https://localhost:3000/api/repos/daniel",
        maxRequests: 200,
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        concurrency: 50,
      },
      (err, result) => {
        if (err) {
          fail(err);
        } else {
          ok(result);
        }
      }
    );
  });

  const theAnswer = await results;
  expect(theAnswer).toHaveProperty("rps");
  expect(theAnswer.totalErrors).toBe(0);
});

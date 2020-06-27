require("dotenv").config();
const loadtest = require("loadtest");
const { createValidJWT } = require("../utils/front-helpers");
const token = createValidJWT(
  { email: "danielrbetteridge@gmail.com" },
  process.env.SECRET
);
console.log(token);
jest.setTimeout(40000);
it("Load tests the Repos API", async () => {
  const results = new Promise((ok, fail) => {
    loadtest.loadTest(
      {
        insecure: true,
        url: "https://gitdocs.page/api/repos/daniel",
        maxRequests: 1000,
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        concurrency: 100,
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

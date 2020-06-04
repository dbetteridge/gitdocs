const mailjet = require("node-mailjet").connect(
  "e84375f954f9aacbcd28fd21d1ce3784",
  "fb3b08b3b1c8b6d56680c4934dc32b27"
);
const request = mailjet.post("send", { version: "v3.1" }).request({
  Messages: [
    {
      From: {
        Email: "admin@gitdocs.page",
        Name: "Daniel",
      },
      To: [
        {
          Email: "admin@gitdocs.page",
          Name: "Daniel",
        },
      ],
      Subject: "Greetings from Mailjet.",
      TextPart: "My first Mailjet email",
      HTMLPart:
        "<h3>Dear passenger 1, welcome to <a href='https://www.mailjet.com/'>Mailjet</a>!</h3><br />May the delivery force be with you!",
      CustomID: "AppGettingStartedTest",
    },
  ],
});
request
  .then((result) => {
    console.log(result.body);
  })
  .catch((err) => {
    console.log(err.statusCode);
  });

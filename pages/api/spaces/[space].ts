import { inviteMember, isOwner } from "@controllers/Spaces";
import { fetchUser } from "@utils/helpers";
import mailjet from "node-mailjet";

const message = (invite_token, space, owner, user) => {
  return {
    From: {
      Email: "admin@gitdocs.page",
      Name: "Gitdocs Admin",
    },
    To: [{ Email: user }],
    Subject: `${owner} has invited you to https://gitdocs.page/${space}`,
    TextPart: `${owner} has invited you to https://gitdocs.page/${space}`,
    HTMLPart: `
    <h3>Please click the link below to accept</h3><br/>
    <a href=https://gitdocs.page/register/${invite_token}>Accept Invite</a>`,
    CustomID: invite_token,
  };
};

export default async (req, res) => {
  if (req.method === "POST") {
    const { space } = req.query;
    const { users } = JSON.parse(req.body);
    try {
      const user = await fetchUser(req);
      if (isOwner(space, user)) {
        const results = await Promise.all(
          users.map((sUser) => inviteMember(space, sUser))
        );
        // Send emails
        const messages = results
          .filter(({ invite_token }) => invite_token)
          .map(({ invite_token, space, user: sUser }) =>
            message(invite_token, space, user.name, sUser)
          );
        if (messages.length > 0) {
          mailjet
            .connect(process.env.MAILJET_API, process.env.MAILJET_SECRET)
            .post("send", { version: "v3.1" })
            .request({
              Messages: messages,
            });
        }
        res.status(200);
        res.json(results);
      } else {
        res.status(403);
        res.json({
          error: "You do not have access to add users to this space",
        });
      }
    } catch (err) {
      res.status(403);
      res.json({ error: err });
    }
  }
};

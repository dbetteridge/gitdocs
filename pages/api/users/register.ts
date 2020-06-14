import { register } from "@controllers/Users";
import { createValidJWT } from "@utils/front-helpers";
export default async (req, res) => {
  const { body } = req;
  const registrationDetails = JSON.parse(body);
  const result = await register(registrationDetails);

  if (result.rows) {
    const user = result.rows[0];
    const token = createValidJWT(user.register, process.env.SECRET);
    if (result.invite) {
      res.json({ token, invite: result.invite });
    } else {
      res.json({ token });
    }
  } else {
    res.json({ error: result.detail });
  }
};

import { register } from "@controllers/Users";
import jwt from "jsonwebtoken";
export default async (req, res) => {
  const { body } = req;
  const registrationDetails = JSON.parse(body);
  const result = await register(registrationDetails);

  if (result.rows) {
    const user = result.rows[0];
    const token = jwt.sign(user.register, process.env.SECRET);
    if (result.invite) {
      res.json({ token, invite: result.invite });
    } else {
      res.json({ token });
    }
  } else {
    res.json({ error: result.detail });
  }
};

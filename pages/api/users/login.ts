import { login } from "@controllers/Users";
import jwt from "jsonwebtoken";
import { createValidJWT } from "@utils/front-helpers";
export default async (req, res) => {
  const { body } = req;
  if (req.method === "POST" && body) {
    const loginDetails = JSON.parse(body);
    const result = await login(loginDetails);
    const user = result.rows[0];

    if (user.login) {
      const token = createValidJWT(user.login, process.env.SECRET);
      res.json(token);
    } else {
      res.json("");
    }
  }
};

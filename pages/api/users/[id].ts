import { getUser } from "@controllers/Users";
import { getMembers } from "@controllers/Spaces";

export default async (req, res) => {
  const { id } = req.query;

  const user = await getUser(id);

  if (user) {
    res.status(200);
    res.json(user);
  } else {
    res.status(404);
    res.json({});
  }
};

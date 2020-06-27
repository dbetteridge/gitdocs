import { getUser } from "@controllers/Users";
import { fetchUser } from "@utils/helpers";

export default async (req, res) => {
  const { id } = req.query;

  const user = await getUser(id);
  try {
    await fetchUser(req);
  } catch (err) {
    res.status(403);
    res.json({ error: JSON.stringify(err) });
  }

  if (user) {
    res.status(200);
    res.json(user);
  } else {
    res.status(404);
    res.json({});
  }
};

import { getUsers } from "@controllers/Users";
import { fetchUser } from "@utils/helpers";
export default async (req, res) => {
  try {
    await fetchUser(req);
  } catch (err) {
    res.status(403);
    res.json({ error: JSON.stringify(err) });
  }
  const users = await getUsers();
  res.json(users);
};

import { getSpaces } from "@controllers/Users";
import { addSpace } from "@controllers/Spaces";
import { fetchUser } from "@utils/helpers";

export default async (req, res) => {
  if (req.method === "GET") {
    const user = await fetchUser(req);
    const spaces = await getSpaces(user);
    res.json(spaces);
  }

  if (req.method === "POST") {
    const { space } = JSON.parse(req.body);
    const user = await fetchUser(req);
    const newSpace = await addSpace(space, user.email);
    res.json(newSpace);
  }
};

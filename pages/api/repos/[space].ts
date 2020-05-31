import { addRepo } from "@controllers/Repos";
import { getRepos } from "@controllers/Spaces";
import { getSpaces } from "@controllers/Users";
import { fetchUser } from "@utils/helpers";
import Space from "@models/Space";

export default async (req, res) => {
  if (req.method === "GET") {
    const { space: spaceID } = req.query;
    const user = await fetchUser(req);
    const spaces = await getSpaces(user);
    const space = spaces.find((item: Space) => item.id === spaceID);
    if (space) {
      const repos = await getRepos(space);
      res.status(200);
      res.json(repos);
    } else {
      res.status(403);
      res.json({ error: "You are not a member of this space" });
    }
  }

  if (req.method === "POST") {
    const { repo } = JSON.parse(req.body);
    const { space: spaceID } = req.query;
    const user = await fetchUser(req);
    const spaces: any = await getSpaces(user);
    const space: Space = spaces.find((item: Space) => item.id === spaceID);
    if (space) {
      const newRepo = await addRepo(repo, space.id);
      res.json(newRepo);
    } else {
      res.status(403);
      res.json({ error: "You are not a member of this space" });
    }
  }
};

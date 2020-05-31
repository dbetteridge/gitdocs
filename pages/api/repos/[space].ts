import { addRepo } from "@controllers/Repos";
import { getRepos } from "@controllers/Spaces";

import { isAllowed } from "@utils/helpers";

export default async (req, res) => {
  if (req.method === "GET") {
    const { space } = req.query;
    const allowed = await isAllowed(req, space, res);
    if (allowed) {
      const repos = await getRepos(space);
      res.status(200);
      res.json(repos);
    }
  }

  if (req.method === "POST") {
    const { repo } = JSON.parse(req.body);
    const { space } = req.query;
    await isAllowed(req, space, res);

    const newRepo = await addRepo(repo, space.id);
    res.json(newRepo);
  }
};

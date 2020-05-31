import { getDocsBySpaceRepo, getDocByPath } from "@controllers/Docs";
import { getRepoBySpaceOrgType } from "@controllers/Repos";

export default async (req, res) => {
  if (req.method === "POST") {
    const { space, type, org, repo, path } = JSON.parse(req.body);
    const repoDB = await getRepoBySpaceOrgType(space, org, type, repo);

    if (path) {
      const doc = await getDocByPath(
        space,
        repoDB.id,
        decodeURIComponent(path)
      );
      res.json(doc);
    } else {
      const docs = await getDocsBySpaceRepo(space, repoDB.id);
      res.json(docs);
    }
  }
};

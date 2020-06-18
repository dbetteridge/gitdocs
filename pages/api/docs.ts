import { getDocsBySpaceRepo, getDocByPath } from "@controllers/Docs";
import {
  getRepoBySpaceOrgType,
  addAzureDocs,
  addGithubDocs,
} from "@controllers/Repos";
import { isAllowed } from "@utils/helpers";
import { getTokenByRepoSpace } from "@controllers/Tokens";

export default async (req, res) => {
  if (req.method === "POST") {
    const { space, type, org, repo, path } = JSON.parse(req.body);
    if (!space || !type || !org || !repo) {
      res.status(400);
      res.send();
    }
    const allowed = await isAllowed(req, space, res);
    if (allowed) {
      const repoDB = await getRepoBySpaceOrgType(space, org, type, repo);

      if (path) {
        const doc = await getDocByPath(
          space,
          repoDB.id,
          decodeURIComponent(path)
        );
        res.json(doc);
      } else {
        let docs = await getDocsBySpaceRepo(space, repoDB.id);
        let token = await getTokenByRepoSpace(repoDB, space);
        if (docs.length === 0) {
          console.log(token);
          if (!token.id) {
            res.status(400).json({ error: "No docs and no valid token" });
            return;
          }
          if (repoDB.type === "github") {
            await addGithubDocs(repoDB, space);
          } else {
            await addAzureDocs(repoDB, space);
          }
          docs = await getDocsBySpaceRepo(space, repoDB.id);
        }

        res.json(docs);
      }
    } else {
      res.status(403);
      res.send({ err: "Access Denied" });
    }
  }
};

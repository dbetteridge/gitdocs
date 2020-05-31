// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import marked from "marked";
import * as azdev from "azure-devops-node-api";
import { VersionControlRecursionType } from "azure-devops-node-api/interfaces/GitInterfaces";
import { getRepoBySpaceOrgType } from "@controllers/Repos";
import { type } from "os";
import { getDocsBySpaceRepo, addDoc } from "@controllers/Docs";
import { getTokenByRepoSpace } from "@controllers/Tokens";
import { fetchUser } from "@utils/helpers";
import Token from "@models/Token";

export default async (req, res) => {
  const { authURL, appID, scopes } = process.env;
  const { org, repo, type, space, project } = req.query;
  const repoDB = await getRepoBySpaceOrgType(space, org, type, repo);
  const user = await fetchUser(req);

  const docs = await getDocsBySpaceRepo(space, repoDB.id);

  if (docs.length > 0) {
    res.statusCode = 200;
    res.json(docs);
  } else {
    const tokenDB: Token = await getTokenByRepoSpace(repoDB, space);
    let token = tokenDB.access_token;

    console.log(token);
    let orgUrl = `https://dev.azure.com/${org}`;

    let authHandler = azdev.getPersonalAccessTokenHandler(token);
    let connection = new azdev.WebApi(orgUrl, authHandler);
    let git = await connection.getGitApi();
    const tree = await git.getItems(
      repo,
      project,
      "",
      VersionControlRecursionType.Full
    );
    Promise.all(
      tree
        .filter((item) => item.path.endsWith(".md"))
        .map(async (markdownFile) => {
          const contentStream = await git.getItemContent(
            repo,
            markdownFile.path,
            project
          );
          const chunks = [];
          for await (let chunk of contentStream) {
            chunks.push(chunk);
          }

          let buffer = Buffer.concat(chunks);
          const markdownString = buffer.toString();

          addDoc({
            source: repoDB.id,
            name: markdownFile.path,
            path: markdownFile.path,
            owner: space,
            markdown: markdownString,
            html: marked(markdownString),
          });
          return {
            name: markdownFile.path,
            markdown: markdownString,
            html: marked(markdownString),
          };
        })
    ).then((data) => {
      res.statusCode = 200;
      res.json(data);
    });
  }
};

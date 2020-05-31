// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import * as azdev from "azure-devops-node-api";
import { isAllowed } from "@utils/helpers";

export default async (req, res) => {
  const { org, project, space } = req.query;
  const { azure_token, token_type } = req.cookies;
  let repoList;
  await isAllowed(req, space, res);
  let orgUrl = `https://dev.azure.com/${org}`;
  let token = azure_token;
  let authHandler = azdev.getPersonalAccessTokenHandler(token);
  try {
    let connection = new azdev.WebApi(orgUrl, authHandler);
    let git = await connection.getGitApi();
    repoList = await git.getRepositories(project);

    repoList.sort((a, b) =>
      a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
    );
    res.statusCode = 200;
    res.json(repoList);
  } catch (err) {
    console.log(err);
  }
};

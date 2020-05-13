// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { client } from "../../utils/cache";
import * as azdev from "azure-devops-node-api";

export default async (req, res) => {
  const { type, org, project } = req.query;
  const { githubBotAccessToken, azuredevopsAccessToken } = process.env;
  let repoList;
  if (type === "github") {
    const repos = await client(
      `https://api.github.com/orgs/${org}/repos?per_page=100`,
      githubBotAccessToken,
      false
    );
    repoList = repos.data;

    if (repos.headers.link) {
      let [next, last] = repos.headers.link.split(",");
      const nextID = next[next.indexOf(">") - 1];
      const lastID = last[last.indexOf(">") - 1];

      const nextURL = next.split(";")[0].replace("<", "").replace(">", "");
      for (let linkID = nextID; linkID < lastID; linkID++) {
        const nextRepos = await client(
          nextURL.replace(`page=${nextID}`, `page=${linkID}`),
          githubBotAccessToken
        );
        if (nextRepos) {
          repoList = [].concat(repoList, nextRepos);
        }
      }
    }
  }
  if (type === "azure") {
    let orgUrl = `https://dev.azure.com/${org}`;
    let token = azuredevopsAccessToken;
    let authHandler = azdev.getPersonalAccessTokenHandler(token);
    let connection = new azdev.WebApi(orgUrl, authHandler);
    let git = await connection.getGitApi();
    repoList = await git.getRepositories(project);
  }
  repoList.sort((a, b) =>
    a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
  );
  res.statusCode = 200;
  res.json(repoList);
};

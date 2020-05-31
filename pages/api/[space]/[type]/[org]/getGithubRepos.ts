// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { client } from "@utils/cache";
import { isAllowed } from "@utils/helpers";

export default async (req, res) => {
  const { org, space } = req.query;
  const { github_token, token_type } = req.cookies;
  let repoList;
  await isAllowed(req, space, res);

  const repos = await client(
    `https://api.github.com/orgs/${org}/repos?per_page=100`,
    github_token,
    false,
    token_type === "bearer"
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
        github_token,
        true,
        token_type === "bearer"
      );
      if (nextRepos) {
        repoList = [].concat(repoList, nextRepos);
      }
    }
  }

  repoList.sort((a, b) =>
    a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
  );
  res.statusCode = 200;
  res.json(repoList);
};

export interface GithubRepo {
  id: string;
  name: string;
  defaultBranch: string;
  project: any;
  remoteUrl: string;
  size: number;
  sshUrl: string;
  url: string;
  webUrl: string;
}

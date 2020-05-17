// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import marked from "marked";
import * as azdev from "azure-devops-node-api";
import { VersionControlRecursionType } from "azure-devops-node-api/interfaces/GitInterfaces";

export default async (req, res) => {
  const { org, repo, project } = req.query;
  const { azure_token } = req.cookies;

  let orgUrl = `https://dev.azure.com/${org}`;
  let token = azure_token;
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
};

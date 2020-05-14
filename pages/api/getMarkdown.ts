// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { client } from "../../utils/cache";
import axios from "axios";
import marked from "marked";
import * as azdev from "azure-devops-node-api";
import { VersionControlRecursionType } from "azure-devops-node-api/interfaces/GitInterfaces";

export default async (req, res) => {
  const { org, repo, project, type } = req.query;
  console.log(org, repo, project, type);
  const { githubBotAccessToken, azuredevopsAccessToken } = process.env;
  if (type === "github") {
    const files = await client(
      `https://api.github.com/repos/${org}/${repo}/git/trees/master?recursive=1`,
      req.headers.authorization,
      true,
      req.headers.token_type === "bearer"
    );
    const markdown = files.tree.filter((file) => file.path.endsWith(".md"));
    console.log(markdown.length);
    Promise.all(
      markdown.map(async (file) => {
        const fileDetails = await axios({
          method: "get",
          url: `https://api.github.com/repos/${org}/${repo}/contents/${file.path}`,
          headers: {
            accept: "application/json",
            Authorization: `${req.headers.token_type} ${req.headers.authorization}`,
          },
        }).then((result) => result.data);
        const { content, download_url, path } = fileDetails;

        const buffer = new Buffer(content, "base64");
        const markdownString = buffer
          .toString()
          .replace(/\]\(!(https?)/g, `](${download_url.split(path)[0]}`); // Convert relative URL's to static URL's to github

        return {
          ...fileDetails,
          markdown: markdownString,
          html: marked(markdownString),
        };
      })
    ).then((data) => {
      res.statusCode = 200;
      res.json(data);
    });
  }

  if (type === "azure") {
    let orgUrl = `https://dev.azure.com/${org}`;
    let token = req.headers.authorization;
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

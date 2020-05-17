// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { client } from "../../../../../utils/cache";
import axios from "axios";
import marked from "marked";

export default async (req, res) => {
  const { org, repo } = req.query;
  const { github_token, token_type } = req.cookies;

  const files = await client(
    `https://api.github.com/repos/${org}/${repo}/git/trees/master?recursive=1`,
    github_token,
    true,
    token_type === "bearer"
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
          Authorization: `${token_type} ${github_token}`,
        },
      }).then((result) => result.data);
      const { content, download_url, path } = fileDetails;

      const buffer = new Buffer(content, "base64");
      const markdownString = buffer
        .toString()
        .replace(/\]\(?!(https?)/g, `](${download_url.split(path)[0]}`); // Convert relative URL's to static URL's to github

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
};

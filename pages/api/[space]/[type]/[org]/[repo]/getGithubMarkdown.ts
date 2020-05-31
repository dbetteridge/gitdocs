// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { client } from "@utils/cache";
import axios from "axios";
import marked from "marked";
import { getDocsBySpaceRepo, addDoc } from "@controllers/Docs";
import { getRepoBySpaceOrgType } from "@controllers/Repos";
import { getTokenByRepoSpace } from "@controllers/Tokens";
import { isAllowed } from "@utils/helpers";

export default async (req, res) => {
  const { org, repo, type, space } = req.query;
  const repoDB = await getRepoBySpaceOrgType(space, org, type, repo);

  const docs = await getDocsBySpaceRepo(space, repoDB.id);
  await isAllowed(req, space, res);

  if (docs.length > 0) {
    res.statusCode = 200;
    res.json(
      docs.sort((a, b) => {
        if (a.path > b.path) {
          return -1;
        } else {
          return 1;
        }
      })
    );
  } else {
    const {
      access_token: github_token,
      token_type,
    } = await getTokenByRepoSpace(repoDB, space);

    const files = await client(
      `https://api.github.com/repos/${org}/${repo}/git/trees/master?recursive=1`,
      github_token,
      true,
      token_type === "bearer"
    );
    const markdownFiles = files.tree.filter((file) =>
      file.path.endsWith(".md")
    );
    Promise.all(
      markdownFiles
        .map(async (file) => {
          const fileDetails = await axios({
            method: "get",
            url: `https://api.github.com/repos/${org}/${repo}/contents/${file.path}`,
            headers: {
              accept: "application/json",
              Authorization: `${token_type} ${github_token}`,
            },
          }).then((result) => result.data);
          const { content, download_url, name } = fileDetails;

          const buffer = new Buffer(content, "base64");
          let markdownString = buffer.toString();

          // Convert relative URL's to static URL's to github
          marked.setOptions({ baseUrl: download_url.split(name)[0] });
          addDoc({
            source: repoDB.id,
            name: fileDetails.name,
            path: fileDetails.path,
            owner: space,
            markdown: markdownString,
            html: marked(markdownString),
          });
          return {
            ...fileDetails,
            markdown: markdownString,
            html: marked(markdownString),
          };
        })
        .sort((a, b) => {
          if (a.path > b.path) {
            return -1;
          } else {
            return 1;
          }
        })
    ).then((data) => {
      res.statusCode = 200;
      res.json(data);
    });
  }
};

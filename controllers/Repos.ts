import Repo from "../models/Repo";
import { getTokenByRepoSpace } from "./Tokens";
import { client } from "@utils/cache";
import axios from "axios";
import marked from "marked";
import { addDoc } from "./Docs";
import Token from "@models/Token";
import * as azdev from "azure-devops-node-api";
import { VersionControlRecursionType } from "azure-devops-node-api/interfaces/GitInterfaces";
import emoji from "node-emoji";

export const getRepos = async () => {
  return await Repo.query();
};

export const getRepo = async (id) => {
  return await Repo.query().findById(id);
};

export const getRepoBySpaceOrgType = async (space, org, type, repo) => {
  return await Repo.query()
    .where({
      owner: space,
      org: org,
      type: type,
      repo: repo,
    })
    .first();
};

export const addAzureDocs = async (repo, space) => {
  if (!repo || !space) {
    throw new Error(`${repo},${space}`);
  }
  const tokenDB: Token = await getTokenByRepoSpace(repo, space);
  let token = tokenDB.access_token;
  let orgUrl = `https://dev.azure.com/${repo.org}`;

  let authHandler = azdev.getPersonalAccessTokenHandler(token);
  let connection = new azdev.WebApi(orgUrl, authHandler);
  let git = await connection.getGitApi();
  const project = decodeURIComponent(repo.project);
  const tree = await git.getItems(
    repo.repo,
    project,
    "",
    VersionControlRecursionType.Full,
    true,
    true,
    false,
    true,
    repo.branch
  );

  if (tree) {
    Promise.all(
      tree
        .filter((item) => item.path.endsWith(".md"))
        .map(async (markdownFile) => {
          const contentStream = await git.getItemContent(
            repo.repo,
            markdownFile.path,
            project,
            "",
            null,
            true,
            true,
            true,
            repo.branch
          );
          const chunks = [];
          for await (let chunk of contentStream) {
            chunks.push(chunk);
          }

          let buffer = Buffer.concat(chunks);
          const markdownString = buffer.toString();

          addDoc({
            source: repo.id,
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
    );
  }
};

const parse = (markdown) => {
  const replacer = (match) => emoji.emojify(match);
  markdown = markdown.replace(/(:.*:)/g, replacer);

  return marked(markdown);
};

export const addGithubDocs = async (repo, space) => {
  const { access_token: github_token, token_type } = await getTokenByRepoSpace(
    repo,
    space
  );

  const files = await client(
    `https://api.github.com/repos/${repo.org}/${repo.repo}/git/trees/${repo.branch}?recursive=1`,
    github_token,
    true,
    token_type === "bearer"
  );
  const markdownFiles = files.tree.filter((file) => file.path.endsWith(".md"));
  Promise.all(
    markdownFiles.map(async (file) => {
      const fileDetails = await axios({
        method: "get",
        url: `https://api.github.com/repos/${repo.org}/${repo.repo}/contents/${file.path}`,
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
        source: repo.id,
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
  );
};

export const addRepo = async (url: string, branch: string, owner: string) => {
  let type, org, project, repo;
  let regexType = /(http(s)?:\/\/(dev.)?)(github|azure)\.com\/([^\/]{1,})(\/)?([^\/]{1,})(\/)?(_git)?(\/)?([^\/]{0,})/;
  const match = url.match(regexType);

  if (url.includes("_git")) {
    //AZURE
    // org 6, project 8, repo 12
    type = match[4];
    org = match[5];
    project = match[7];
    repo = match[11];
  } else {
    //GITHUB
    type = match[4];
    org = match[5];
    repo = match[7];
  }

  const newRepo = await Repo.query().insert({
    url,
    owner,
    type,
    org,
    project,
    repo,
    branch,
  });

  return newRepo;
};

export const getToken = async (repo) => {
  return await Repo.relatedQuery("accessToken").for(repo.token);
};

export const getDocs = async (repo) => {
  return await Repo.relatedQuery("docs").for(repo.id);
};

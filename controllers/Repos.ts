import Repo from "../models/Repo";

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

  // const newRepo = { url, owner, type, org, project, repo };

  return newRepo;
};

export const getToken = async (repo) => {
  return await Repo.relatedQuery("accessToken").for(repo.token);
};

export const getDocs = async (repo) => {
  return await Repo.relatedQuery("docs").for(repo.id);
};

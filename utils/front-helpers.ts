import jwt from "jsonwebtoken";
export function handleChange(key, state, setter) {
  return (event) => {
    setter({ ...state, [key]: event.target.value.trim() });
  };
}

export const timedError = (error, setError, otherFunction) => {
  setError({ hasError: true, error });
  setTimeout(() => {
    setError({ hasError: false, error: "" });
    if (otherFunction && typeof otherFunction === "function") otherFunction();
  }, 1000);
};

export const checkLoginStatus = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return false;
  }
  try {
    const { exp } = jwt.decode(token);
    const now = Date.now() / 1000;
    if (exp < now) {
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
};

export const getUserDetails = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return false;
  }
  try {
    const user = jwt.decode(token);
    return user;
  } catch (err) {
    throw new Error(err);
  }
};

export const createExpiredJWT = () => {
  return jwt.sign(
    { email: "blah", exp: Math.floor(Date.now() / 1000) - 500 },
    "secret"
  );
};

export const createValidJWT = (
  body = { email: "blah" },
  secret = "secret",
  expiry = 3600
) => {
  return jwt.sign(
    { ...body, exp: Math.floor(Date.now() / 1000) + expiry },
    secret
  );
};

export const authAzure = (
  authURL,
  appID,
  user,
  scopes,
  { project, repo, type, org, space }
) => {
  // Go get an azure token
  // Redirects /api/callback
  window.open(
    `${authURL}?client_id=${appID}&response_type=Assertion&state=${JSON.stringify(
      {
        project: project,
        repo: repo,
        type: type,
        org: org,
        space: space,
        owner: user.email,
        scopes: "vso.code",
      }
    )}&scope=${scopes}&redirect_uri=https://${
      process.env.HOST
    }:3000/api/callback`,
    "_target",
    "width=400,height=600"
  );
};

export const authGithub = (
  githubURL,
  clientID,
  user,
  { repo, type, org, space }
) => {
  // Go get a github token
  // Redirects to /api/github_callback
  window.open(
    `${githubURL}?client_id=${clientID}&state=${JSON.stringify({
      repo: repo,
      type: type,
      org: org,
      space: space,
      owner: user.email,
      scopes: "repo",
    })}&scope=repo&redirect_uri=https://${
      process.env.HOST
    }:3000/api/github_callback`,
    "_target",
    "width=400,height=600"
  );
};

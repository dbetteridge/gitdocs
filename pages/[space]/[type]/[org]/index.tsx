import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import getConfig from "next/config";
import getCookies, { refreshCookies } from "../../../../utils/cookies";
import { GithubRepo } from "../../../api/[space]/[org]/getGithubRepos";

const { publicRuntimeConfig } = getConfig();

export default function Home() {
  const router = useRouter();
  const [state, setstate]: [[GithubRepo?], Function] = useState([]);
  const { org, type, project, space } = router.query;
  const {
    githubURL,
    authURL,
    appID,
    scopes,
    clientID,
    clientSecret,
  } = publicRuntimeConfig;

  useEffect(() => {
    const { azure_token, github_token, expiry_time }: any = getCookies();

    const token = type === "azure" ? azure_token : github_token;

    if (token) {
      if (expiry_time < new Date().getTime() / 1000 && type === "azure") {
        const { azure_refresh }: any = getCookies();

        refreshCookies(
          clientSecret,
          azure_refresh,
          "https://localhost:3000/api/callback"
        );
      }
      if (expiry_time > new Date().getTime() / 1000 || type === "github") {
        const getData = async () => {
          if (org) {
            if (type === "github") {
              const data = await fetch(
                `/api/${space}/${org}/getGithubRepos?`
              ).then((res) => res.json());
              setstate(data);
            }

            if (type === "azure") {
              const data = await fetch(
                `/api/${space}/${org}/getAzureRepos?project=${project}`
              ).then((res) => res.json());
              setstate(data);
            }
          }
        };
        getData();
      } else {
      }
    }
  }, [org, type]);

  if (!state.length && type === "azure") {
    return (
      <a
        href={`${authURL}?client_id=${appID}&response_type=Assertion&state=daniel.betteridge@arup.com&scope=${scopes}&redirect_uri=https://localhost:3000/api/callback`}
      >
        Login
      </a>
    );
  }
  if (!state.length && type === "github") {
    return (
      <a
        href={`${githubURL}?client_id=${clientID}&state=daniel.betteridge@arup.com&scope=repo&redirect_uri=https://localhost:3000/api/github_callback`}
      >
        Login
      </a>
    );
  }
  if (state.length || type === "github") {
    return (
      <ul>
        {state &&
          state.map((repo) => (
            <a
              href={`/${space}/${type}/${org}/${repo.name}/${
                project ? `?project=${project}` : ""
              }`}
            >
              <li>{repo.name}</li>
            </a>
          ))}
      </ul>
    );
  }
  return null;
}

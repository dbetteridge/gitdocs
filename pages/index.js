import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import getConfig from "next/config";
import getCookies from "../utils/cookies";

const { publicRuntimeConfig } = getConfig();

export default function Home() {
  const router = useRouter();
  const [state, setstate] = useState(false);
  const { org, type, project } = router.query;
  const { githubURL, authURL, appID, scopes, clientID } = publicRuntimeConfig;

  let token;
  // type==='azure' means we need to follow the oauth flow
  // https://docs.microsoft.com/en-us/azure/devops/integrate/get-started/authentication/oauth?view=azure-devops
  useEffect(() => {
    const { azure_token, github_token, token_type } = getCookies();

    token = type === "azure" ? azure_token : github_token;

    if (token) {
      const getData = async () => {
        if (org) {
          const data = await fetch(
            `/api/getRepos?type=${type}&org=${org}&project=${project}`,
            { headers: { Authorization: `${token}`, token_type } }
          ).then((res) => res.json());
          setstate(data);
        }
      };
      getData();
    }
  }, [org, type]);

  if (!state && type === "azure") {
    return (
      <a
        href={`${authURL}?client_id=${appID}&response_type=Assertion&state=daniel.betteridge@arup.com&scope=${scopes}&redirect_uri=https://localhost:3000/api/callback`}
      >
        Login
      </a>
    );
  }
  if (!state && type === "github") {
    return (
      <a
        href={`${githubURL}?client_id=${clientID}&state=daniel.betteridge@arup.com&scope=repo&redirect_uri=https://localhost:3000/api/github_callback`}
      >
        Login
      </a>
    );
  }
  if (state || type === "github") {
    return (
      <ul>
        {state &&
          state.map((repo) => (
            <a
              href={`/repo?type=${type}&org=${org}&project=${project}&repo=${repo.name}`}
            >
              <li>{repo.name}</li>
            </a>
          ))}
      </ul>
    );
  }
  return null;
}

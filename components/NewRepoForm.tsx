import React, { useState, useContext, useEffect } from "react";
import { Box, Flex } from "rebass";
import { Input, Button } from "antd";
import { handleChange, timedError } from "@utils/front-helpers";
import { store } from "@contexts/store";
import jwt from "jsonwebtoken";

import getConfig from "next/config";
import { useRouter } from "next/router";
import { faCodeBranch, faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const { publicRuntimeConfig } = getConfig();

const createRepo = async (
  details,
  { setState, setRepo, space, toggleForm, setError }
) => {
  const userToken = window.localStorage.getItem("token");
  const repo = await fetch(`/api/repos/${space}`, {
    method: "POST",
    body: JSON.stringify(details),
    headers: { Authorization: userToken },
  })
    .then((d) => {
      if (!d.ok) {
        window.location.replace("/login");
      }
      return d;
    })
    .then((response: Response) => response.json());

  if (!repo.error) {
    setState({ url: details.repo });
    setRepo({ repo: "" });
    toggleForm();
    return repo;
  } else {
    timedError(repo.error, setError, () => setRepo({ repo: "" }));
  }
};

const fetchToken = async (repo, spaceID) => {
  const token = await fetch(`/api/tokens`, {
    method: "POST",
    headers: {
      Authorization: localStorage.getItem("token"),
    },
    body: JSON.stringify({ repo, spaceID }),
  })
    .then((d) => {
      if (!d.ok) {
        window.location.replace("/login");
      }
      return d;
    })
    .then((d) => d.json());
  return token;
};

const NewRepoForm = () => {
  const router = useRouter();
  const [repo, setRepo] = useState({ repo: "", branch: "master" });
  const globalState: any = useContext(store);
  const { dispatch, state } = globalState;
  const { selectedSpace } = state;
  const [owner, setOwner] = useState({});

  useEffect(() => {
    const userToken = window.localStorage.getItem("token");
    const { email } = jwt.decode(userToken);
    setOwner(email);
  }, []);

  const { githubURL, authURL, appID, scopes, clientID } = publicRuntimeConfig;
  const setState = (value) => {
    dispatch({ type: "ADDSPACE", repo: value });
  };

  const toggleForm = () => {
    dispatch({ type: "TOGGLE_NEW_SPACE_FORM" });
  };
  const [error, setError] = useState({ hasError: false, error: "" });

  return (
    <Flex flexDirection={"column"}>
      <Box
        as="form"
        onSubmit={(e) => e.preventDefault()}
        py={3}
        width={[1, 1 / 2]}
        height={"50%"}
      >
        <Flex
          width={1}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Box my={2} width={1}>
            <Input
              autoComplete="repo"
              name="repo"
              placeholder="Repository URL"
              addonAfter={<FontAwesomeIcon icon={faLink} />}
              onChange={handleChange("repo", repo, setRepo)}
              onSelect={handleChange("repo", repo, setRepo)}
              onFocus={handleChange("repo", repo, setRepo)}
              onMouseOver={handleChange("repo", repo, setRepo)}
            ></Input>
          </Box>
          {error.hasError && <Box width={1}>{error.error}</Box>}
          <Box my={2} width={1}>
            <Input
              autoComplete="branch"
              name="branch"
              placeholder="Repository Branch"
              addonAfter={<FontAwesomeIcon icon={faCodeBranch} />}
              onChange={handleChange("branch", repo, setRepo)}
              onSelect={handleChange("branch", repo, setRepo)}
              onFocus={handleChange("branch", repo, setRepo)}
              onMouseOver={handleChange("branch", repo, setRepo)}
            ></Input>
          </Box>
          <Box my={2} width={1}>
            <Button
              name="createRepo"
              type={"primary"}
              onClick={() => {
                if (repo.repo.length === 0) {
                  timedError("Repository URL must be entered", setError, null);
                  return;
                }
                createRepo(repo, {
                  space: selectedSpace,
                  setState,
                  setRepo,
                  toggleForm,
                  setError,
                }).then(async (repo) => {
                  const token: { access_token: string } = await fetchToken(
                    repo,
                    selectedSpace
                  );

                  if (token.access_token) {
                    if (repo.type === "azure") {
                      router.push("/[space]", `/${selectedSpace}`);
                    } else {
                      router.push("/[space]", `/${selectedSpace}`);
                    }
                  } else {
                    if (repo.type === "azure") {
                      // Go get an azure token
                      // Redirects /api/callback
                      window.open(
                        `${authURL}?client_id=${appID}&response_type=Assertion&state=${JSON.stringify(
                          {
                            project: repo.project,
                            repo: repo.repo,
                            type: repo.type,
                            org: repo.org,
                            space: selectedSpace,
                            owner: owner,
                            scopes: "vso.code",
                          }
                        )}&scope=${scopes}&redirect_uri=https://localhost:3000/api/callback`,
                        "_target",
                        "width=400,height=600"
                      );
                    } else {
                      // Go get a github token
                      // Redirects to /api/github_callback
                      window.open(
                        `${githubURL}?client_id=${clientID}&state=${JSON.stringify(
                          {
                            repo: repo.repo,
                            type: repo.type,
                            org: repo.org,
                            space: selectedSpace,
                            owner: owner,
                            scopes: "repo",
                          }
                        )}&scope=repo&redirect_uri=https://localhost:3000/api/github_callback`,
                        "_target",
                        "width=400,height=600"
                      );
                    }
                  }
                });
              }}
            >
              Add
            </Button>
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
};

export default NewRepoForm;

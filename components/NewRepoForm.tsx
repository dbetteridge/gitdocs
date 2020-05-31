import React, { useState, useContext, useEffect } from "react";
import { Box, Flex, Button } from "rebass";
import { Label, Input } from "@rebass/forms";
import { handleChange } from "@utils/front-helpers";
import { store } from "@contexts/store";
import jwt from "jsonwebtoken";

import getConfig from "next/config";
import { useRouter } from "next/router";
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
  }).then((response: Response) => response.json());

  if (!repo.error) {
    setState({ url: details.repo });
    setRepo({ repo: "" });
    toggleForm();
    return repo;
  } else {
    setError({ hasError: true, error: repo.error });
    setTimeout(() => {
      setError({ hasError: false, error: "" });
      setRepo({ repo: "" });
    }, 1000);
  }
};

const fetchToken = async (repo, spaceID) => {
  const token = await fetch(`/api/tokens`, {
    method: "POST",
    headers: {
      Authorization: localStorage.getItem("token"),
    },
    body: JSON.stringify({ repo, spaceID }),
  }).then((d) => d.json());
  return token;
};

const NewRepoForm = () => {
  const router = useRouter();
  const [repo, setRepo] = useState({ repo: "" });
  const globalState: any = useContext(store);
  const { dispatch, state } = globalState;
  const { selectedSpace } = state;
  const [token, setToken] = useState(false);
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
    <Flex
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Box
        as="form"
        onSubmit={(e) => e.preventDefault()}
        py={3}
        width={[3 / 4, 1 / 4]}
        height={"50%"}
      >
        <Flex
          width={1}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Box px={2} my={2} width={1}>
            <Label py={2} htmlFor="repo">
              New Repo
            </Label>
            <Input
              autoComplete="repo"
              name="repo"
              onChange={handleChange("repo", repo, setRepo)}
              onSelect={handleChange("repo", repo, setRepo)}
              onFocus={handleChange("repo", repo, setRepo)}
              onMouseOver={handleChange("repo", repo, setRepo)}
            ></Input>
          </Box>
          {error.hasError && <Box>{error.error}</Box>}
          <Box px={2} my={2} width={1}>
            <Button
              name="createRepo"
              variant="primary"
              mr={2}
              onClick={() => {
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
                      router.push(
                        `/${selectedSpace}/${repo.type}/${repo.org}/${repo.repo}/${repo.project}`
                      );
                    } else {
                      router.push(
                        `/${selectedSpace}/${repo.type}/${repo.org}/${repo.repo}`
                      );
                    }
                  } else {
                    if (repo.type === "azure") {
                      // Go get an azure token
                      // Redirects /api/callback
                      window.location.href = `${authURL}?client_id=${appID}&response_type=Assertion&state=${JSON.stringify(
                        {
                          project: repo.project,
                          repo: repo.repo,
                          type: repo.type,
                          org: repo.org,
                          space: selectedSpace,
                          owner: owner,
                          scopes: "vso.code",
                        }
                      )}&scope=${scopes}&redirect_uri=https://localhost:3000/api/callback`;
                    } else {
                      // Go get a github token
                      // Redirects to /api/github_callback
                      window.location.href = `${githubURL}?client_id=${clientID}&state=${JSON.stringify(
                        {
                          repo: repo.repo,
                          type: repo.type,
                          org: repo.org,
                          space: selectedSpace,
                          owner: owner,
                          scopes: "repo",
                        }
                      )}&scope=repo&redirect_uri=https://localhost:3000/api/github_callback`;
                    }
                  }
                });
              }}
            >
              Create
            </Button>
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
};

export default NewRepoForm;

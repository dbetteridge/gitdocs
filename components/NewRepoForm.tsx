import React, { useState, useContext } from "react";
import { Box, Flex, Button } from "rebass";
import { Label, Input } from "@rebass/forms";
import { handleChange } from "../utils/front-helpers";
import { store } from "../contexts/store";

const createRepo = async (
  details,
  { setState, setRepo, space, toggleForm, setError }
) => {
  const token = window.localStorage.getItem("token");
  const repo = await fetch(`/api/repos/${space}`, {
    method: "POST",
    body: JSON.stringify(details),
    headers: { Authorization: token },
  }).then((response: Response) => response.json());

  if (!repo.error) {
    setState({ url: details.repo });
    setRepo({ repo: "" });
    toggleForm();
  } else {
    setError({ hasError: true, error: repo.error });
    setTimeout(() => {
      setError({ hasError: false, error: "" });
      setRepo({ repo: "" });
    }, 1000);
  }
};

const NewRepoForm = () => {
  const [repo, setRepo] = useState({ repo: "" });
  const globalState: any = useContext(store);
  const { dispatch, state } = globalState;
  const { selectedSpace } = state;
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

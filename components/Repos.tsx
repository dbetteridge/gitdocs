import React, { useEffect, useState, useContext } from "react";
import { Card, Heading, Button, Flex } from "rebass";
import { store } from "../contexts/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import NewRepoForm from "./NewRepoForm";
import { useRouter } from "next/router";

const fetchRepos = async (setter, space) => {
  const repos = await fetch(`/api/repos/${space}`, {
    method: "GET",
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  }).then((d) => d.json());
  setter(repos);
};

const Name = (props) => (
  <Button
    {...props}
    px={3}
    py={3}
    my={3}
    sx={{ marginRight: "1rem" }}
    variant={props.selected ? "primary" : "secondary"}
  />
);

const Repos = () => {
  const router = useRouter();
  const globalState: any = useContext(store);
  const { dispatch, state } = globalState;
  const { repos, selectedRepo, selectedSpace } = state;

  const setUserRepos = (value) => {
    dispatch({ type: "SETREPOS", repos: value });
  };

  const setSelected = (value) => {
    dispatch({ type: "SELECT_REPO", repo: value });
  };

  useEffect(() => {
    if (router.query.space) {
      dispatch({ type: "SELECT_SPACE", space: router.query.space });
      fetchRepos(setUserRepos, router.query.space);
    }
  }, [router.query]);

  return (
    <Card
      width={[1, 3 / 4]}
      px={5}
      sx={(props) => ({ backgroundColor: props.colors.muted })}
    >
      <Heading>Repos</Heading>
      <Flex
        my={2}
        flexDirection={"row"}
        justifyContent={""}
        alignItems={"center"}
      >
        {repos.map((repo) => (
          <Name
            key={repo.id}
            selected={selectedRepo === repo.url}
            onClick={() => {
              setSelected(repo.url);
              // router.push(`/${selectedSpace}/${repo.url}`);
            }}
          >
            {repo.repo}
          </Name>
        ))}
      </Flex>
      <Button
        onClick={() => {
          dispatch({ type: "TOGGLE_NEW_REPO_FORM" });
        }}
      >
        <FontAwesomeIcon icon={faPlus} />
      </Button>
      {state.showNewRepoForm && <NewRepoForm />}
    </Card>
  );
};

export default Repos;

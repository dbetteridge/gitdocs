import React, { useEffect, useState, useContext } from "react";
import { Card, Heading, Button, Flex } from "rebass";
import { store } from "../contexts/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import NewRepoForm from "./NewRepoForm";
import { useRouter } from "next/router";
import InviteForm from "@components/InviteForm";
import FullWidthLine from "./FullWidthLine";
import useSWR from "swr";

const fetchRepos = async (setter, space) => {
  if (!space) {
    return null;
  }
  const repos = await fetch(`/api/repos/${space}`, {
    method: "GET",
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  })
    .then((d) => {
      return d;
    })
    .then((d) => d.json());
  setter(repos);
  return repos;
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
    const repo = repos.filter((repo) => repo.url === value)[0];
    dispatch({ type: "SELECT_REPO", repo: value, repoData: repo });
    if (repo.type === "github") {
      router.push(
        "/[space]/[type]/[org]/[repo]",
        `/${selectedSpace}/${repo.type}/${repo.org}/${repo.repo}`
      );
    } else {
      router.push(
        "/[space]/[type]/[org]/[repo]?project=[project]",
        `/${selectedSpace}/${repo.type}/${repo.org}/${repo.repo}?project=${repo.project}`
      );
    }
  };
  useEffect(() => {
    dispatch({ type: "SELECT_SPACE", space: router.query.space });
  }, [router.query]);

  const { data, error } = useSWR(state.selectedSpace, (space) =>
    fetchRepos(setUserRepos, space)
  );
  if (error) {
    return null;
  }
  return (
    <Card
      width={[1, 1]}
      mx={2}
      px={4}
      py={3}
      sx={(props) => ({ backgroundColor: props.colors.muted })}
    >
      <Heading>Repos</Heading>
      <Flex my={2} flexDirection={"row"} alignItems={"center"} flexWrap="wrap">
        {repos.map((repo) => (
          <Name
            key={repo.id}
            selected={selectedRepo === repo.url}
            onClick={() => {
              setSelected(repo.url);
            }}
          >
            {repo.repo}
          </Name>
        ))}
      </Flex>

      <Button
        mb={4}
        onClick={() => {
          dispatch({ type: "TOGGLE_NEW_REPO_FORM" });
        }}
      >
        <FontAwesomeIcon icon={state.showNewRepoForm ? faMinus : faPlus} />
      </Button>

      {state.showNewRepoForm && <FullWidthLine />}
      {state.showNewRepoForm && <NewRepoForm />}
      <FullWidthLine />
      <InviteForm />
    </Card>
  );
};

export default Repos;

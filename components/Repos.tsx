import React, { useEffect, useContext } from "react";
import { Card, Heading, Flex } from "rebass";
import { store } from "../contexts/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import NewRepoForm from "./NewRepoForm";
import { useRouter } from "next/router";
import InviteForm from "@components/InviteForm";
import FullWidthLine from "./FullWidthLine";
import { Button, Spin } from "antd";
import { Row, Col } from "antd/lib/grid";
import styled from "@emotion/styled";

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
      if (!d.ok) {
        window.location.href = "/login";
      }
      return d;
    })
    .then((d) => d.json());
  setter(repos);
  return repos;
};

const Name = styled(Button)`
  margin-bottom: 1rem;
  margin-right: 1rem;
`;

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
    if (router.query.space) {
      dispatch({ type: "SELECT_SPACE", space: router.query.space });
      fetchRepos(setUserRepos, router.query.space);
    }
  }, [router.query]);

  if (!repos) {
    return (
      <Row>
        <Col xs={2}></Col>
        <Col xs={20}>
          <Spin />
        </Col>
        <Col xs={2}></Col>
      </Row>
    );
  }
  return (
    <Row>
      <Col xs={2}></Col>
      <Col xs={20}>
        <Card
          width={[1, 1]}
          px={4}
          py={3}
          my={4}
          sx={(props) => ({
            backgroundColor: props && props.colors && props.colors.muted,
          })}
        >
          <Heading>Repos</Heading>
          <Flex
            my={2}
            flexDirection={"row"}
            alignItems={"center"}
            flexWrap="wrap"
          >
            {repos &&
              repos.map((repo) => (
                <Name
                  type={selectedRepo === repo.url ? "primary" : "default"}
                  key={repo.id}
                  onClick={() => {
                    setSelected(repo.url);
                  }}
                >
                  {repo.org}/{repo.repo}
                </Name>
              ))}
          </Flex>

          <Button
            type={"primary"}
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
      </Col>
      <Col xs={2}></Col>
    </Row>
  );
};

export default Repos;

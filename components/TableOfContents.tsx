import React, { useEffect, useState, useContext } from "react";
import { Card, Heading, Button, Flex } from "rebass";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import Link from "next/link";
import Repo from "@models/Repo";
import useSWR from "swr";

const TableOfContents = () => {
  const router = useRouter();
  const { space, type, org, repo, project } = router.query;
  const [docs, setDocs] = useState([]);
  const [repoDB, setRepo] = useState<Repo>();

  const fetchRepo = async (setter, space, repo) => {
    const repos = await fetch(`/api/repos/${space}`, {
      method: "GET",
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    })
      .then((d) => {
        if (!d.ok) {
          window.location.replace("/login");
        }
        return d;
      })
      .then((d) => d.json());
    const repoDB: Repo = repos.filter((srepo) => srepo.repo === repo)[0];
    setter(repoDB);
  };

  const fetchDocs = async (setter) => {
    const docs = await fetch(`/api/docs`, {
      method: "POST",
      headers: {
        Authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify({
        space: space,
        type: type,
        org: org,
        repo: repo,
      }),
    })
      .then((d) => {
        if (!d.ok) {
          window.location.replace("/login");
        }
        return d;
      })
      .then((d) => d.json());
    setter(docs);
  };

  useSWR(`/api/repos/${space}`, () => fetchRepo(setRepo, space, repo));
  useSWR(
    () => (space ? JSON.stringify({ space, type, org, repo }) : null),
    () => fetchDocs(setDocs)
  );

  return (
    <Card width={1} sx={(props) => ({ backgroundColor: props.colors.muted })}>
      <Heading>Table of contents</Heading>

      <Flex flexDirection={"column"} px={3}>
        {docs &&
          docs
            .sort((a, b) => {
              return a.path.split("/").length > b.path.split("/").length
                ? 1
                : -1;
            })
            .map((doc) => (
              <Flex
                justifyContent={"space-between"}
                alignItems={"center"}
                flexWrap={"wrap"}
                height={80}
                width={[0.75, 1]}
              >
                <a
                  href={
                    project
                      ? `/${space}/${type}/${org}/${repo}/${encodeURIComponent(
                          doc.path
                        )}?project=${project}`
                      : `/${space}/${type}/${org}/${repo}/${encodeURIComponent(
                          doc.path
                        )}`
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    project
                      ? router.push(
                          "/[space]/[type]/[org]/[repo]/[path]?project=[project]",
                          `/${space}/${type}/${org}/${repo}/${encodeURIComponent(
                            doc.path
                          )}?project=${project}`
                        )
                      : router.push(
                          "/[space]/[type]/[org]/[repo]/[path]",
                          `/${space}/${type}/${org}/${repo}/${encodeURIComponent(
                            doc.path
                          )}`
                        );
                  }}
                >
                  {doc.path}
                </a>
                {repoDB && (
                  <a
                    href={repoDB.url + "/blob/master/" + doc.path}
                    target="__blank"
                  >
                    <Button height={30}>
                      <Flex
                        flexDirection={"row"}
                        justifyContent={"space-between"}
                        alignItems={"center"}
                        height={"100%"}
                      >
                        <span>Source</span>
                        <FontAwesomeIcon icon={faLink} />
                      </Flex>
                    </Button>
                  </a>
                )}
              </Flex>
            ))}
      </Flex>
    </Card>
  );
};

export default TableOfContents;

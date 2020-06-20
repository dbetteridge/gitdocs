import React, { useEffect, useState } from "react";
import { Card, Heading } from "rebass";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import Repo from "@models/Repo";
import { Table, Spin, Row, Col } from "antd";

import getConfig from "next/config";
import { getUserDetails, authAzure, authGithub } from "@utils/front-helpers";
import StyledCard from "./StyledCard";
const { publicRuntimeConfig } = getConfig();

const TableOfContents = () => {
  const router = useRouter();
  const { space, type, org, repo, project } = router.query;
  const [docs, setDocs] = useState([]);
  const [state, setState] = useState({ sortedDocs: [], docLinks: [] });
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
    if (repos && repos.length) {
      const repoDB: Repo = repos.filter((srepo) => srepo.repo === repo)[0];
      setter(repoDB);
    }
  };

  const fetchDocs = async (setter) => {
    const {
      githubURL,
      authURL,
      appID,
      scopes,
      GITHUB_ID,
      HOST_URL,
    } = publicRuntimeConfig;
    const user = getUserDetails();

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
          // Do something to show an auth error here
          if (d.status === 400) {
            if (type === "azure") {
              authAzure(authURL, appID, user, scopes, HOST_URL, {
                space,
                org,
                type,
                repo,
                project,
              });
            } else {
              authGithub(githubURL, GITHUB_ID, user, HOST_URL, {
                space,
                org,
                type,
                repo,
              });
            }
          }
        }
        return d;
      })
      .then((d) => d.json());
    setter(docs);
  };

  useEffect(() => {
    if (space) {
      fetchRepo(setRepo, space, repo);
      if (type && org && repo) {
        fetchDocs(setDocs);
      }
    }
  }, [space, type, org, repo, project]);

  useEffect(() => {
    if (docs && docs.length > 0) {
      sortDocs();
    }
  }, [docs]);

  useEffect(() => {
    if (state.sortedDocs) {
      extractDocLinks(state.sortedDocs);
    }
  }, [state.sortedDocs]);

  const sortDocs = () => {
    const sorted = docs
      .sort((a, b) => {
        return a.path.split("/").length > b.path.split("/").length ? 1 : -1;
      })
      .sort((a, b) => (a.path.split("/")[0] > b.path.split("/")[0] ? 1 : -1));

    if (!state.sortedDocs.length) {
      setState({ ...state, sortedDocs: sorted });
    }
  };

  const extractDocLinks = (sortedDocs) => {
    const docLinks = sortedDocs.map((doc) => ({
      docLink: (
        <a
          key={doc.path}
          href={""}
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
      ),

      sourceLink: repoDB && repoDB.url && (
        <a
          href={repoDB.url + "/blob/master/" + doc.path}
          target={"__blank"}
          key={repoDB.url + "/blob/master/" + doc.path}
        >
          <FontAwesomeIcon icon={faLink} />
        </a>
      ),
    }));

    if (!state.docLinks.length) {
      setState({ ...state, docLinks });
    }
  };
  const columns = [
    { title: "Doc Link", dataIndex: "docLink", key: "docLink" },
    { title: "Source Link", dataIndex: "sourceLink", key: "sourceLink" },
  ];

  if (!state.docLinks || !docs) {
    return (
      <Row
        style={{
          width: "100%",
          height: "calc(100vh - 50px - 4rem)",
          marginTop: "2rem",
        }}
      >
        <Col xs={2}></Col>
        <Col xs={20}>
          <StyledCard>
            <Spin />
          </StyledCard>
        </Col>
        <Col xs={2}></Col>
      </Row>
    );
  }

  return (
    <Card width={1} sx={(props) => ({ backgroundColor: props.colors.muted })}>
      <Heading>Table of contents</Heading>

      {docs && docs.length > 0 && (
        <Table columns={columns} dataSource={state.docLinks} />
      )}
    </Card>
  );
};

export default TableOfContents;

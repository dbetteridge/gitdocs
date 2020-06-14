import React, { useEffect, useState, useContext } from "react";
import { Card, Heading, Flex } from "rebass";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink, faCodeBranch } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import Repo from "@models/Repo";
import { Table } from "antd";

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
    if (repos) {
      const repoDB: Repo = repos.filter((srepo) => srepo.repo === repo)[0];
      setter(repoDB);
    }
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
          // Do something to show an auth error here
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
    if (docs) {
      sortDocs();
    }
  }, [docs]);

  useEffect(() => {
    if (state.sortedDocs) {
      extractDocLinks(state.sortedDocs);
    }
  }, [state.sortedDocs]);

  const sortDocs = () => {
    const sorted = docs.sort((a, b) => {
      return a.path.split("/").length > b.path.split("/").length ? 1 : -1;
    });

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

      sourceLink: (
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

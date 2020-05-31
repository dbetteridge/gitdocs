import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import TableOfContents from "@components/TableOfContents";

export default function Repo() {
  const router = useRouter();
  const [state, setstate] = useState([]);
  const { org, repo, type, space, project } = router.query;

  useEffect(() => {
    const getData = async () => {
      if (org && repo) {
        if (type === "github") {
          const userToken = window.localStorage.getItem("token");
          const data = await fetch(
            `/api/${space}/${type}/${org}/${repo}/getGithubMarkdown`,
            {
              method: "GET",
              headers: { Authorization: userToken },
            }
          )
            .then((d) => {
              if (!d.ok) {
                window.location.replace("/login");
              }
              return d;
            })
            .then((res) => res.json());
          setstate(data);
        }

        if (type === "azure") {
          const userToken = window.localStorage.getItem("token");
          const data = await fetch(
            `/api/${space}/${type}/${org}/${repo}/${project}/getAzureMarkdown`,
            {
              method: "GET",
              headers: { Authorization: userToken },
            }
          )
            .then((d) => {
              if (!d.ok) {
                window.location.replace("/login");
              }
              return d;
            })
            .then((res) => res.json());
          setstate(data);
        }
      }
    };
    getData();
  }, [org, repo]);

  return <TableOfContents />;
}

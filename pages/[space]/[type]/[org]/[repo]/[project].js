import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Repo() {
  const router = useRouter();
  const [state, setstate] = useState([]);
  const { org, repo, type, project, space } = router.query;

  useEffect(() => {
    const getData = async () => {
      if (org && repo) {
        if (type === "azure") {
          const data = await fetch(
            `/api/${space}/${org}/${repo}/${project}/getAzureMarkdown`
          ).then((res) => res.json());
          setstate(data);
        }
      }
    };
    getData();
  }, [org, repo]);

  return (
    <div
      className="container"
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
      }}
    >
      {state &&
        state.map((file) => (
          <span
            style={{
              border: "1px solid black",
              padding: "1rem",
              width: "100%",
            }}
            key={file.path}
          >
            <h3>{file.name}</h3>
            <article
              dangerouslySetInnerHTML={{ __html: file.html }}
              className="markdown-body"
            />
          </span>
        ))}
      <style jsx global>{`
        img {
          max-width: 100%;
        }

        .markdown-body {
          box-sizing: border-box;
          min-width: 200px;
          max-width: 980px;
          margin: 0 auto;
          padding: 45px;
        }

        @media (max-width: 767px) {
          .markdown-body {
            padding: 15px;
          }
        }
      `}</style>
    </div>
  );
}

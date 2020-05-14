import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import getCookies from "../utils/cookies";

export default function Repo() {
  const router = useRouter();
  const [state, setstate] = useState([]);
  const { org, repo, type, project } = router.query;

  let token;
  useEffect(() => {
    const { azure_token, github_token, token_type } = getCookies();
    token = type === "azure" ? azure_token : github_token;
    const getData = async () => {
      if (org && repo) {
        const data = await fetch(
          `/api/getMarkdown?type=${type}&org=${org}&project=${project}&repo=${repo}`,
          { headers: { Authorization: `${token}`, token_type } }
        ).then((res) => res.json());
        setstate(data);
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
          <div
            style={{
              border: "1px solid black",
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
              width: "100%",
            }}
            key={file.path}
          >
            <h3>{file.name}</h3>
            <div dangerouslySetInnerHTML={{ __html: file.html }} />
          </div>
        ))}
      <style jsx global>{`
        img {
          max-width: 100%;
        }
      `}</style>
    </div>
  );
}

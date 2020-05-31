import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Doc from "@models/Doc";

export default function Document() {
  const router = useRouter();
  const { space, type, org, repo, project, path } = router.query;
  const [doc, setDoc] = useState<Doc>();
  const fetchDoc = async (setDoc) => {
    const doc = await fetch(`/api/docs`, {
      method: "POST",
      headers: {
        Authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify({
        space: space,
        type: type,
        org: org,
        repo: repo,
        path,
      }),
    })
      .then((d) => {
        if (!d.ok) {
          router.push("/login");
        }
        return d;
      })
      .then((d) => d.json());
    setDoc(doc);
  };

  useEffect(() => {
    if (path) {
      fetchDoc(setDoc);
    }
  }, [path]);
  if (doc) {
    return (
      <span
        style={{
          border: "1px solid black",
          padding: "1rem",
        }}
        key={doc.path}
      >
        {/** TODO: Link to single file view page  */}
        <h3>{doc.name}</h3>
        <article
          dangerouslySetInnerHTML={{ __html: doc.html }}
          className="markdown-body"
        />
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
      </span>
    );
  } else {
    return null;
  }
}

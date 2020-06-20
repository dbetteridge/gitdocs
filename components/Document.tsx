import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Doc from "@models/Doc";

import styled from "@emotion/styled";

const AlignedH3 = styled.h3`
  margin-left: 45px;
  @media (max-width: 767px) {
    margin-left: 15px;
  }
`;

const DocumentContainer = styled.div`
  padding: 1rem;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media (max-width: 500px) {
    padding: 0rem;
  }
`;

export default function Document() {
  const router = useRouter();
  const { space, type, org, repo, path } = router.query;
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
          router.push(
            "/[space]/[type]/[org]/[repo]",
            `/${space}/${type}/${org}/${repo}`
          );
        }
        return d;
      })
      .then((d) => d.json());
    setDoc(doc);
  };

  useEffect(() => {
    if (space && type && org && repo && path) fetchDoc(setDoc);
  }, [space, type, org, repo, path]);

  if (doc && doc.html) {
    return (
      <DocumentContainer key={doc.path}>
        {/** TODO: Link to single file view page  */}

        <AlignedH3>{doc.name}</AlignedH3>
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
            width: 100%;
            padding: 45px;
          }

          @media (max-width: 767px) {
            .markdown-body {
              padding: 15px;
            }
          }
        `}</style>
      </DocumentContainer>
    );
  } else {
    return null;
  }
}

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const [state, setstate] = useState([]);
  const { org, type, project } = router.query;
  useEffect(() => {
    const getData = async () => {
      if (org) {
        const data = await fetch(
          `/api/getRepos?type=${type}&org=${org}&project=${project}`
        ).then((res) => res.json());
        setstate(data);
      }
    };
    getData();
  }, [org]);

  return (
    <ul>
      {state &&
        state.map((repo) => (
          <a
            href={`/repo?type=${type}&org=${org}&project=${project}&repo=${repo.name}`}
          >
            <li>{repo.name}</li>
          </a>
        ))}
    </ul>
  );
}

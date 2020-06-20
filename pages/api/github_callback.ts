import axios from "axios";
import { addToken } from "@controllers/Tokens";
import { OAuthTokenResponse } from "@interfaces/Login";
import { addGithubDocs, getRepoBySpaceOrgType } from "@controllers/Repos";

export default async (req, res) => {
  const { code, state } = req.query;
  const { GITHUB_ID, GITHUB_SECRET } = process.env;
  const { repo, org, type, space, owner, scopes } = JSON.parse(state);
  if (code) {
    const result = await axios({
      method: "POST",
      url: "https://github.com/login/oauth/access_token",
      headers: {
        "content-type": "application/json",
      },
      data: JSON.stringify({
        client_id: GITHUB_ID,
        client_secret: GITHUB_SECRET,
        code,
        redirect_uri: `https://${process.env.HOST_URL}/api/github_callback`,
        state,
      }),
    }).then((response) => {
      let obj: OAuthTokenResponse = {};
      const params = new URLSearchParams(response.data).entries();
      for (let entry of params) {
        obj[entry[0]] = entry[1];
      }

      return obj;
    });

    await addToken(result, type, org, space, owner, scopes);
  }

  const repoDB = await getRepoBySpaceOrgType(space, org, type, repo);
  await addGithubDocs(repoDB, space);

  res.writeHead(302, {
    Location: `/close`,
  });
  res.end();
};

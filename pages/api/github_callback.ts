import axios from "axios";
import { addToken } from "../../controllers/Tokens";
import { OAuthTokenResponse } from "../../interfaces/Login";

export default async (req, res) => {
  const { code, state } = req.query;
  const { clientID, githubSecret } = process.env;

  const result = await axios({
    method: "POST",
    url: "https://github.com/login/oauth/access_token",
    headers: {
      "content-type": "application/json",
    },
    data: JSON.stringify({
      client_id: clientID,
      client_secret: githubSecret,
      code,
      redirect_uri: "https://localhost:3000/api/github_callback",
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

  console.log(result, state);
  const { org, type, space, owner, scopes } = JSON.parse(state);
  addToken(result, type, org, space, owner, scopes);

  res.writeHead(302, {
    "Set-Cookie": [
      `github_token=${result.access_token};path=/;`,
      `token_type=${result.token_type};path=/;`,
    ],
    "Content-Type": "text/plain",
    Location: `/${space}/${type}/${org}`,
  });
  res.end();
};

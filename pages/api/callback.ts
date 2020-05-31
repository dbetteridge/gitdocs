import axios from "axios";
import { addToken } from "@controllers/Tokens";
import { OAuthTokenResponse } from "@interfaces/Login";

export default async (req, res) => {
  const { code, state } = req.query;
  const { clientSecret, tokenURL } = process.env;
  console.log(state);

  const result: OAuthTokenResponse = await axios({
    method: "POST",
    url: tokenURL,
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    data: `client_assertion_type=urn:ietf:params:oauth:client-assertion-type:jwt-bearer&client_assertion=${clientSecret}&grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${code}&redirect_uri=https%3A%2F%2Flocalhost%3A3000%2Fapi%2Fcallback`,
  }).then((response) => response.data);

  const time = new Date().getTime();

  const expiry_time: number = +result.expires_in + time / 1000;
  result.expiry_time = Math.trunc(expiry_time);
  const { project, repo, org, type, space, owner, scopes } = JSON.parse(state);
  addToken(result, type, org, space, owner, scopes);

  res.writeHead(302, {
    Location: `/${space}/${type}/${org}/${repo}?project=${project}`,
  });
  res.end();
};

import axios from "axios";

interface OAuthTokenResponse {
  access_token?: string;
  token_type?: string;
  expires_in?: number;
  refresh_token?: string;
}

export default async (req, res) => {
  const { code } = req.query;
  const { clientSecret, tokenURL } = process.env;

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
  res.writeHead(302, {
    "Set-Cookie": [
      `azure_token=${result.access_token};path=/;`,
      `token_type=${result.token_type};path=/;`,
      `azure_refresh=${result.refresh_token};path=/`,
      `expiry_time=${expiry_time};path=/`,
    ],
    "Content-Type": "text/plain",
    Location: `/?type=azure`,
  });
  res.end();
};

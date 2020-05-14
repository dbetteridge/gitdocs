import axios from "axios";

interface OAuthTokenResponse {
  access_token?: string;
  token_type?: string;
  expires_in?: number;
  refresh_token?: string;
  expiry_time?: number;
}

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
    const time = new Date().getTime();
    obj.expiry_time = (+obj.expires_in + time) / 1000;
    return obj;
  });

  res.writeHead(302, {
    "Set-Cookie": [
      `github_token=${result.access_token};path=/;`,
      `token_type=${result.token_type};path=/;`,
      `github_refresh=${result.refresh_token};path=/`,
      `expiry_time=${result.expiry_time};path=/`,
    ],
    "Content-Type": "text/plain",
    Location: `/?type=github`,
  });
  res.end();
};

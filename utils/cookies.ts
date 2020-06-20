export default function getCookies() {
  const cookies: string[] = document.cookie.split(";");
  let cookieObject: object = {};
  cookies.map((cookie) => {
    const [key, value] = cookie.split("=");
    cookieObject[key.trim()] = value;
  });
  return cookieObject;
}

export function setCookie(name, value, days = null) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

export const refreshToken = async (refresh_token) => {
  const result = await fetch(
    "https://app.vssps.visualstudio.com/oauth2/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": "1654",
      },
      body: `client_assertion_type=urn:ietf:params:oauth:client-assertion-type:jwt-bearer&client_assertion=${process.env.clientSecret}&grant_type=refresh_token&assertion=${refresh_token}&redirect_uri=https://${process.env.HOST_URL}/api/callback`,
    }
  ).then((res) => res.json());

  return result;
};

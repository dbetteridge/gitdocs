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

export const refreshCookies = async (
  clientSecret,
  azure_refresh,
  callback_url
) => {
  const cookies = await fetch(
    "https://app.vssps.visualstudio.com/oauth2/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": "1654",
      },
      body: `client_assertion_type=urn:ietf:params:oauth:client-assertion-type:jwt-bearer&client_assertion=${clientSecret}&grant_type=refresh_token&assertion=${azure_refresh}&redirect_uri=${callback_url}`,
    }
  ).then((res) => res.json());

  setCookie("azure_token", cookies["access_token"]);
  setCookie("azure_refresh", cookies["refresh_token"]);
  setCookie(
    "expiry_time",
    new Date().getTime() / 1000 + +cookies["expires_in"]
  );
  location.reload();
};

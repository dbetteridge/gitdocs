export default function getCookies() {
  const cookies: string[] = document.cookie.split(";");
  let cookieObject: object = {};
  cookies.map((cookie) => {
    const [key, value] = cookie.split("=");
    cookieObject[key.trim()] = value;
  });
  return cookieObject;
}

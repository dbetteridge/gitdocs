import jwt from "jsonwebtoken";
export function handleChange(key, state, setter) {
  return (event) => {
    setter({ ...state, [key]: event.target.value.trim() });
  };
}

export const timedError = (error, setError, otherFunction) => {
  setError({ hasError: true, error });
  setTimeout(() => {
    setError({ hasError: false, error: "" });
    if (otherFunction && typeof otherFunction === "function") otherFunction();
  }, 1000);
};

export const checkLoginStatus = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return false;
  }
  try {
    const { exp } = jwt.decode(token);
    const now = Date.now() / 1000;
    if (exp < now) {
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
};

export const createExpiredJWT = () => {
  return jwt.sign(
    { email: "blah", exp: Math.floor(Date.now() / 1000) - 500 },
    "secret"
  );
};

export const createValidJWT = (
  body = { email: "blah" },
  secret = "secret",
  expiry = 3600
) => {
  return jwt.sign(
    { ...body, exp: Math.floor(Date.now() / 1000) + expiry },
    secret
  );
};

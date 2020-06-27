import { getUser, validSpace } from "../controllers/Users";
import jwt from "jsonwebtoken";
import Space from "@models/Space";

export function omit(list: object[], properties: string[]): object[] {
  list.forEach((item) => {
    properties.forEach((property) => {
      delete item[property];
    });
  });
  return list;
}

export async function fetchUser(request) {
  const {
    headers: { authorization, Authorization },
  } = request;
  const userDetails = jwt.verify(
    authorization || Authorization,
    process.env.SECRET
  );
  const user = await getUser(userDetails.email);
  return user;
}

export async function isAllowed(request, spaceID, res) {
  try {
    const user = await fetchUser(request);
    const spaces = await validSpace(user, spaceID);
    const inSpace = spaces.length && spaces.length > 0;
    if (!inSpace) {
      res.status(403);
      res.json({ error: "No access to this space" });
    } else {
      return true;
    }
  } catch (err) {
    res.status(403);
    res.json({ error: JSON.stringify(err) });
  }
}

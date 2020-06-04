import { getUser, getSpaces } from "../controllers/Users";
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
    headers: { authorization },
  } = request;
  const userDetails = jwt.verify(authorization, process.env.SECRET);
  const user = await getUser(userDetails.email);
  return user;
}

export async function isAllowed(request, spaceID, res) {
  try {
    const user = await fetchUser(request);
    const spaces = await getSpaces(user);
    const inSpace = spaces.find((space: Space) => space.id === spaceID);
    if (!inSpace) {
      res.status(403);
      res.json({ error: "No access to this space" });
    } else {
      return true;
    }
  } catch (err) {
    res.status(403);
    res.json({ error: err });
  }
}

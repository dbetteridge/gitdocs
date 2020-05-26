import { getUser } from "../controllers/Users";
import jwt from "jsonwebtoken";

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
  const userDetails = jwt.decode(authorization);
  const user = await getUser(userDetails.email);
  return user;
}

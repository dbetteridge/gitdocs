import { getUsers } from "../../../controllers/Users";
export default async (req, res) => {
  const users = await getUsers();
  res.json(users);
};

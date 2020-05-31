import { getTokenByRepoSpace } from "@controllers/Tokens";

export default async (req, res) => {
  if (req.method === "POST") {
    const { repo, spaceID } = JSON.parse(req.body);
    const token = await getTokenByRepoSpace(repo, spaceID);
    res.json(token);
  }
};

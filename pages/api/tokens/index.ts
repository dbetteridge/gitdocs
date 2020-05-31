import { getTokenByRepoSpace } from "@controllers/Tokens";
import { isAllowed } from "@utils/helpers";

export default async (req, res) => {
  if (req.method === "POST") {
    const { repo, spaceID } = JSON.parse(req.body);
    await isAllowed(req, spaceID, res);
    const token = await getTokenByRepoSpace(repo, spaceID);
    res.json(token);
  }
};

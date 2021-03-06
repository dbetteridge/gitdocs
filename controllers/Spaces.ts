import Space from "../models/Space";
import UserSpace from "../models/UserSpace";
import Repo from "../models/Repo";
import { createInvite } from "./Invites";
import { getUser } from "./Users";

export const getSpaces = async () => {
  return await Space.query();
};

export const getSpace = async (id) => {
  return await Space.query().findById(id);
};

export const getMembers = async (space) => {
  return await Space.relatedQuery("users").for(space.id);
};

export const addMember = async (space, user) => {
  return await UserSpace.query().insert({ user, space }).returning("*");
};

export const isOwner = async (space, user) => {
  const spaces = await Space.query().where({ id: space, owner: user.email });
  return spaces.length > 0;
};

export const inviteMember = async (space, user) => {
  const userDB = await getUser(user);
  if (userDB) {
    return await addMember(space, user);
  } else {
    const invite_token = await createInvite(space, user);
    return invite_token;
  }
};

export const addSpace = async (id: string, owner: string) => {
  const newSpace = await Space.query().insert({ id, owner });
  await UserSpace.query().insert({
    user: owner,
    space: newSpace.id,
  });

  return newSpace;
};

export const getRepos = async (space) => {
  const repos = await Repo.query().where({ owner: space });
  if (repos) return repos;
  else return [];
};

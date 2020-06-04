import UserSpace from "../models/UserSpace";

export const getMembers = async (space: string) => {
  return await UserSpace.query().where({ space });
};

export const addMember = async (space, user) => {
  return await UserSpace.query().insert({ user: user.id, space: space.id });
};

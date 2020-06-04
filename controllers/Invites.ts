import Invite from "../models/Invite";
import UserSpace from "@models/UserSpace";

export const getInvites = async () => {
  return await Invite.query();
};

export const getInvite = async (invite_token) => {
  return await Invite.query().where({ invite_token }).first();
};

export const createInvite = async (space, user) => {
  return await Invite.query().insert({ space, user }).returning("*");
};

export const acceptInvite = async (invite_token, user) => {
  const invite: Invite = await getInvite(invite_token);
  await Invite.query().where({ invite_token }).delete();
  return await UserSpace.query().insert({ space: invite.space, user });
};

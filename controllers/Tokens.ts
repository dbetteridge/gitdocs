import Token from "../models/Token";
import { OAuthTokenResponse } from "../interfaces/Login";
import Repo from "../models/Repo";
import { refreshToken } from "../utils/cookies";

export const getTokens = async () => {
  return await Token.query();
};

export const getToken = async (id) => {
  return await Token.query().findById(id);
};

export const getTokenByRepoSpace = async (repo: Repo, spaceID: string) => {
  const token = await Token.query()
    .where({
      type: repo.type,
      org: repo.org,
      space: spaceID,
    })
    .first();

  if (
    token &&
    token.expiry_time &&
    token.expiry_time < new Date().getTime() / 1000
  ) {
    return updateToken(token);
  } else {
    return token ? token : new Token();
  }
};

export const addToken = async (
  token: OAuthTokenResponse,
  type,
  org,
  space,
  owner,
  scopes
) => {
  const tokenDB = await Token.query().insert({
    access_token: token.access_token,
    refresh_token: token.refresh_token,
    token_type: token.token_type,
    expiry_time: token.expiry_time,
    type,
    org,
    space,
    owner,
    scopes,
  });

  await Repo.query()
    .update({
      token: tokenDB.id,
    })
    .where({ type: type, org: org, owner: space });

  return tokenDB;
};

export const updateToken = async (token) => {
  const updatedToken = await refreshToken(token.refresh_token);
  const time = new Date().getTime();

  const expiry_time: number = +updatedToken.expires_in + time / 1000;
  updatedToken.expiry_time = expiry_time;
  delete updatedToken.expires_in;
  delete updatedToken.scope;
  return await Token.query()
    .update({ ...updatedToken })
    .where({ id: token.id })
    .returning("*")
    .first();
};

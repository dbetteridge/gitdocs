import Token from "../models/Token";
import { OAuthTokenResponse } from "../interfaces/Login";

export const getTokens = async () => {
  return await Token.query();
};

export const getToken = async (id) => {
  return await Token.query().findById(id);
};

export const getTokenByRepoSpace = async (repo, spaceID) => {
  return await Token.query().where({
    type: repo.type,
    org: repo.org,
    space: spaceID,
  });
};

export const addToken = async (
  token: OAuthTokenResponse,
  type,
  org,
  space,
  owner,
  scopes
) => {
  return await Token.query().insert({
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
};

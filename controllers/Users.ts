import User from "../models/User";
import db from "../utils/db";
import { LoginCredentials, RegistrationDetails } from "../interfaces/Login";
import { acceptInvite } from "./Invites";

export const getUsers = () => {
  return User.query().select(["email", "name", "lastLogin", "created"]);
};

export const getUser = (email) => {
  return User.query()
    .findById(email)
    .select(["email", "name", "lastLogin", "created"]);
};

export const login = (credentials: LoginCredentials) => {
  return db.raw(`SELECT login(?,?);`, [
    credentials.email,
    credentials.password,
  ]);
};

export const register = async (details: RegistrationDetails) => {
  try {
    const result = await db.raw(`SELECT register(?,?,?);`, [
      details.name,
      details.email,
      details.password,
    ]);
    if (details.email.length === 0 || !details.email) {
      return { detail: "You must supply an email" };
    }
    if (details.invite_token) {
      const invite = await acceptInvite(details.invite_token, details.email);
      result.invite = invite;
      return result;
    }
    return result;
  } catch (err) {
    const matches = err.detail.match(/Key \(email\)=\(.+\) already exists\./);
    if (matches && matches.length > 0) {
      return { detail: "User with this email address exists" };
    }
    return err;
  }
};

/**
 * Returns the spaces your are owner of
 * @param user User object
 *
 */
export const getMySpaces = async (user) => {
  return User.relatedQuery("ownSpaces").for(user.email);
};

/**
 * Returns the spaces your are a member of
 * @param user User object
 *
 */
export const getSpaces = async (user) => {
  return User.relatedQuery("spaces").for(user.email);
};

export const getTokens = async (user) => {
  return User.relatedQuery("tokens").for(user.email);
};

export const deleteUser = (email) => {
  return User.query().deleteById(email);
};

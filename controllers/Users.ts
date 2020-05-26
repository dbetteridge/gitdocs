import User from "../models/User";
import db from "../utils/db";
import { LoginCredentials, RegistrationDetails } from "../interfaces/Login";

export const getUsers = () => {
  return User.query();
};

export const getUser = (email) => {
  return User.query().findById(email);
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
    return result;
  } catch (err) {
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

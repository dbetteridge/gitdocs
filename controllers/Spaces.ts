import Space from "../models/Space";
import db from "../utils/db";

export const getSpaces = async () => {
  return await Space.query();
};

export const getSpace = async (id) => {
  return await Space.query().findById(id);
};

export const getMembers = async (space) => {
  return await Space.relatedQuery("users").for(space.id);
};

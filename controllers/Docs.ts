import Doc, { DocI } from "../models/Doc";

export const getDocs = async () => {
  return await Doc.query();
};

export const getDocsBySpaceRepo = async (space, repo) => {
  return await Doc.query().where({ owner: space, source: repo });
};

export const getDocByPath = async (space, repo, path) => {
  const doc = await Doc.query()
    .where({ owner: space, source: repo, path })
    .first();
  return doc;
};

export const addDoc = async (doc: DocI) => {
  const newDoc = await Doc.query().insert({ ...doc });

  return newDoc;
};

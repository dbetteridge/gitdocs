import { Model } from "objection";
import db from "../utils/db";

Model.knex(db);

class Repo extends Model {
  url: string;
  owner: string;
  type: string;
  org: string;
  project: string | null;
  repo: string;

  static tableName = "repos";
  static idColumn = "id";

  static relationMappings() {
    const Space = require("./Space").default;
    const Token = require("./Token").default;
    const Doc = require("./Doc").default;

    return {
      space: {
        relation: Model.BelongsToOneRelation,
        modelClass: Space,
        join: {
          from: "repos.owner",
          to: "spaces.id",
        },
      },
      token: {
        relation: Model.HasOneRelation,
        modelClass: Token,
        join: {
          from: "repos.token",
          to: "tokens.id",
        },
      },
      docs: {
        relation: Model.HasManyRelation,
        modelClass: Doc,
        join: {
          from: "repos.id",
          to: "docs.source",
        },
      },
    };
  }
}

export default Repo;

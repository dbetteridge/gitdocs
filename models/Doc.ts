import { Model } from "objection";
import db from "../utils/db";

Model.knex(db);

class Doc extends Model {
  id: number;
  name: string;
  path: string;
  html: string;
  markdown: string;

  static tableName = "docs";
  static idColumn = "id";

  static relationMappings() {
    const Space = require("./Space").default;

    return {
      docOwner: {
        relation: Model.BelongsToOneRelation,
        modelClass: Space,
        join: {
          from: "docs.owner",
          to: "spaces.id",
        },
      },
    };
  }
}

export default Doc;

export interface DocI {
  name: string;
  path: string;
  source: number;
  owner: string;
  markdown: string;
  html: string;
}

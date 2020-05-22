import { Model } from "objection";
import db from "../utils/db";

Model.knex(db);

class Doc extends Model {
  static tableName() {
    return "docs";
  }

  static idColumn() {
    return "id";
  }

  static relationMappings() {
    const Space = require("./Space").default;

    return {
      owner: {
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

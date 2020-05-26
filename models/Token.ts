import { Model } from "objection";
import db from "../utils/db";

Model.knex(db);

class Token extends Model {
  static tableName = "tokens";

  static idColumn = "id";

  static relationMappings() {
    const User = require("./User").default;
    const Space = require("./Space").default;
    return {
      owner: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "tokens.owner",
          to: "users.email",
        },
      },
      space: {
        relation: Model.BelongsToOneRelation,
        modelClass: Space,
        join: {
          from: "tokens.space",
          to: "spaces.id",
        },
      },
    };
  }
}

export default Token;

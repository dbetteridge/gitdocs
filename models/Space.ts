import { Model } from "objection";
import db from "../utils/db";
import { getMembers } from "../controllers/Spaces";

Model.knex(db);

class Space extends Model {
  static tableName() {
    return "spaces";
  }

  static idColumn() {
    return "id";
  }

  getMembers = () => getMembers(this);

  static relationMappings() {
    const Token = require("./Token").default;
    const User = require("./User").default;

    return {
      tokens: {
        relation: Model.HasManyRelation,
        modelClass: Token,
        join: {
          from: "space.id",
          to: "token.space",
        },
      },
      users: {
        relation: Model.ManyToManyRelation,
        modelClass: User,
        join: {
          from: "spaces.id",
          through: {
            from: "user_space.space",
            to: "user_space.user",
          },
          to: "users.email",
        },
      },
    };
  }
}

export default Space;

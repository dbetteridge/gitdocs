import { Model } from "objection";
import db from "../utils/db";
import { getMembers } from "../controllers/Spaces";

Model.knex(db);

class Space extends Model {
  id: string;
  owner: string;

  static tableName = "spaces";
  static idColumn = "id";

  getMembers = () => getMembers(this);

  static relationMappings() {
    const Token = require("./Token").default;
    const User = require("./User").default;
    const Repo = require("./Repo").default;

    return {
      tokens: {
        relation: Model.HasManyRelation,
        modelClass: Token,
        join: {
          from: "spaces.id",
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
      repos: {
        relation: Model.HasManyRelation,
        modelClass: Repo,
        join: {
          from: "spaces.id",
          to: "repos.owner",
        },
      },
    };
  }
}

export default Space;

import { Model } from "objection";
import db from "../utils/db";
import { omit } from "../utils/helpers";
import { getMySpaces, getTokens } from "../controllers/Users";

Model.knex(db);

class User extends Model {
  email: string;
  name: string;

  static idColumn = "email";

  static tableName = "users";

  getMySpaces = () => getMySpaces(this);

  getTokens = () => getTokens(this);

  static relationMappings() {
    const Space = require("./Space").default;
    const Token = require("./Token").default;

    return {
      ownSpaces: {
        relation: Model.HasManyRelation,
        modelClass: Space,
        join: {
          from: "users.email",
          to: "spaces.owner",
        },
      },
      spaces: {
        relation: Model.ManyToManyRelation,
        modelClass: Space,
        join: {
          from: "users.email",
          through: {
            from: "user_space.user",
            to: "user_space.space",
          },
          to: "spaces.id",
        },
      },
      tokens: {
        relation: Model.HasManyRelation,
        modelClass: Token,
        join: {
          from: "users.email",
          to: "tokens.owner",
        },
      },
    };
  }
}

export default User;

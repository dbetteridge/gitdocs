import { Model } from "objection";
import db from "../utils/db";
import { omit } from "../utils/helpers";
import { getMySpaces, getTokens } from "../controllers/Users";

Model.knex(db);

class User extends Model {
  static idColumn = "email";

  static tableName = "users";

  static query(...args) {
    const query = super.query(...args);
    return query.runAfter((result) => {
      return omit(result, ["hash"]);
    });
  }

  getMySpaces = () => getMySpaces(this);

  getTokens = () => getTokens(this);

  static relationMappings() {
    const Space = require("./Space").default;
    const Token = require("./Token").default;

    return {
      spaces: {
        relation: Model.HasManyRelation,
        modelClass: Space,
        join: {
          from: "users.email",
          to: "spaces.owner",
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

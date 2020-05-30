import { Model } from "objection";
import db from "../utils/db";

Model.knex(db);

class Token extends Model {
  static tableName = "tokens";

  static idColumn = "id";
  static type = "type";
  static org = "org";
  static accessToken = "access_token";
  static refreshToken = "refresh_token";
  static tokenType = "token_type";
  static expiryTime = "expiry_time";
  static scopes = "scopes";
  static owner = "owner";
  static space = "space";
  static created = "created";
  id: number;
  expiry_time: number;
  access_token: string;
  token_type: string;
  refresh_token: string;
  type: string;
  org: string;
  space: string;
  owner: string;
  scopes: string;

  static relationMappings() {
    const User = require("./User").default;
    const Space = require("./Space").default;
    return {
      ownerUser: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "tokens.owner",
          to: "users.email",
        },
      },
      parentSpace: {
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

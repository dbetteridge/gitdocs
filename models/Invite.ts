import { Model } from "objection";
import db from "../utils/db";

Model.knex(db);

class Invite extends Model {
  id: string;
  space: string;
  user: string;

  static tableName = "invites";
  static idColumn = "id";

  static relationMappings() {
    const Space = require("./Space").default;
    const User = require("./User").default;

    return {
      inviteSpace: {
        relation: Model.HasOneRelation,
        modelClass: Space,
        join: {
          from: "invites.space",
          to: "spaces.id",
        },
      },
      inviteUser: {
        relation: Model.HasOneRelation,
        modelClass: User,
        join: {
          from: "invites.user",
          to: "users.email",
        },
      },
    };
  }
}

export default Invite;

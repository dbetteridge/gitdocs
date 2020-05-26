import { Model } from "objection";
import db from "../utils/db";

Model.knex(db);

class UserSpace extends Model {
  user: string;
  space: string;

  static tableName = "user_space";
  static idColumn = "id";
}

export default UserSpace;

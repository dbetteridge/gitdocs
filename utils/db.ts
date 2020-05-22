import Knex from "knex";
import config from "../knexfile";

const envConfig = config[process.env.NODE_ENV];
export default Knex(envConfig);

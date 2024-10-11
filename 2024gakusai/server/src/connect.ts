import * as sql from "mysql2/promise";
import { access } from "./database";
export const connection = async()=>{
  return await sql.createConnection(access);
}
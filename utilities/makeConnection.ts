import { createConnection } from "mysql";
import { promisify } from "util";

export default () => {
  const password = process.env.SQL_PASSWORD;
  if (!password) throw new Error("You are missing a necessary environment variable.");

  const con = createConnection({
    host: "localhost",
    user: process.env.SQL_USER || "root",
    password,
    database: "amarti_lecha",
  });

  const connect = promisify(con.connect).bind(con);
  const query = promisify(con.query).bind(con);
  const end = promisify(con.end).bind(con);

  return { connect, query, end };
};

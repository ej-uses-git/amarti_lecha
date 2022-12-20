import { createConnection } from "mysql";
import { promisify } from "util";

export default () => {
  const con = createConnection({
    host: "localhost",
    user: "root",
    password: "hilma",
    database: "amarti_lecha",
  });

  const connect = promisify(con.connect).bind(con);
  const query = promisify(con.query).bind(con);
  const end = promisify(con.end).bind(con);

  return { connect, query, end };
};

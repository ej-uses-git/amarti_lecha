import { QueryFunction } from "../types/makeConnection";
import { MessagingWebhookBody } from "../types/MessagingRequest";

export const isRegistered = async (
  query: QueryFunction,
  body: MessagingWebhookBody
) => {
  const existingIdQuery = await query({
    sql: `SELECT true FROM user WHERE user_id = ?`,
    values: [body.AccountSid],
  });

  if (!(existingIdQuery instanceof Array))
    throw new Error(
      "Received a query result that isn't an array - what the fuck"
    );

  return existingIdQuery[0];
};

export default async (query: QueryFunction, body: MessagingWebhookBody) => {
  const exists = await isRegistered(query, body);
  if (!exists) {
    await query({
      sql: `INSERT INTO user (user_id, user_name, user_phone) VALUES (?,?,?)`,
      values: [body.AccountSid, body.ProfileName, body.From],
    });
    return ["מוסיפים אותך לרשימה..." + "\nשלום, " + body.ProfileName + "!"];
  } else {
    return ["אתה כבר רשום אצלנו..", "ברוך השב, " + body.ProfileName + "!"];
  }
};

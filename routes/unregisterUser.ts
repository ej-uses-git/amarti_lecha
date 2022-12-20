import { QueryFunction } from "../types/makeConnection";
import { MessagingWebhookBody } from "../types/MessagingRequest";
import { isRegistered } from "./registerUser";

export default async (query: QueryFunction, body: MessagingWebhookBody) => {
  const exists = await isRegistered(query, body);

  if (!exists) {
    return ["אנחנו לא יכולים למחוק אתכם מהרשימה - \n" + "אתם לא רשומים..."];
  }

  await query({
    sql: `
      DELETE FROM user
      WHERE user_id = ?
    `,
    values: [body.AccountSid],
  });

  return ["נמחקתם מהרשימה בהצלחה!\n" + "מקווים שאתם נהנים להיות פחדנים..."];
};

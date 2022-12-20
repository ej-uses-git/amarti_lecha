import splitAmarti from "../utilities/splitAmarti";
import { QueryFunction } from "../types/makeConnection";
import { MessagingWebhookBody } from "../types/MessagingRequest";
import { isRegistered } from "./registerUser";

const joinMessage = process.env.TWILIO_JOIN_MESSAGE || "join birthday-lovely";

export default async (query: QueryFunction, body: MessagingWebhookBody) => {
  const exists = await isRegistered(query, body);

  if (!exists) {
    return [
      `אי אפשר לשמור את ה"אמרתי לך", כי אתם לא רשומים...`,
      `שלחו "הרשמה" כדי להירשם.`,
    ];
  }

  const match = splitAmarti(body.Body);
  if (!match)
    return [
      "ההודעה שלכם מנוסחת בצורה לא נכונה...\n" +
        "אנא ודאו שההודעה נשלחת בצורה:\n\n" +
        "אמרתי לך\n" +
        "*מספר טלפון*\n" +
        "*תאריך*\n" +
        "*ההודעה לשלוח*\n\n" +
        "שימו 💖:\n" +
        "התאריך צריך להיות בצורה YYYY-MM-DD, וצריך להתחיל שורה חדשה אחרי כל חלק בהודעה.",
    ];

  const victimIdQuery = await query({
    sql: `
      SELECT user_id FROM user WHERE user_phone = ? 
    `,
    values: [match.phone],
  });

  if (!(victimIdQuery instanceof Array))
    throw new Error(
      "Received query response that isn't an array - what the fuck."
    );

  if (!victimIdQuery[0])
    return [
      "לא ניתן לשלוח הודעות למישהו שלא רשום.\nרוצים לשלוח לחברים שלכם הודעה? שירשמו!\nניתן להירשם במספר הזה, לאחר שליחת ההודעה:\n" +
        joinMessage +
        "\nולאחר מכן שליחת ההודעה\nהרשמה",
    ];

  await query({
    sql: `
      INSERT INTO bet (content, occurs_on, better_id, victim_id)
      VALUES (?, ?, ?, ?)
    `,
    values: [
      match.content,
      match.date,
      body.AccountSid,
      victimIdQuery[0].user_id,
    ],
  });

  return ["נשמר בהצלחה! נשלח את ההודעה בתאריך " + match.date];
};

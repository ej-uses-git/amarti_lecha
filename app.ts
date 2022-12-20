import express from "express";
import { urlencoded } from "body-parser";
import { twiml, Twilio } from "twilio";
import makeConnection from "./utilities/makeConnection";
import { MessagingRequest } from "./types/MessagingRequest";
import registerUser from "./routes/registerUser";
import sendMessages from "./utilities/sendMessages";
import helpMessage from "./routes/helpMessage";
import checkRequest from "./utilities/checkRequest";
import saveBet from "./routes/saveBet";
import VictimDetails from "./types/VictimDetails";
import unregisterUser from "./routes/unregisterUser";
import welcomeMessage from "./routes/welcomeMessage";

const MessagingResponse = twiml.MessagingResponse;
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_NUMBER;

const app = express();

app.use(urlencoded({ extended: false }));

app.post("/sms", async (req: MessagingRequest, res) => {
  const { connect, query, end } = makeConnection();
  const whatsappResponse = new MessagingResponse();
  const addToResponse = sendMessages(whatsappResponse);

  try {
    await connect();

    let messages: string[];
    switch (checkRequest(req.body.Body)) {
      case "REGISTER":
        messages = await registerUser(query, req.body);
        break;
      case "AMARTI LECHA":
        messages = await saveBet(query, req.body);
        break;
      case "UNREGISTER":
        messages = await unregisterUser(query, req.body);
        break;
      case "WELCOME":
        messages = welcomeMessage();
        break;
      default:
        messages = helpMessage();
        break;
    }
    addToResponse(messages);

    await end();
  } catch (error: any) {
    if (!error?.fatal) await end();
    console.log(error);
    whatsappResponse.message(
      "אני מצטער, נתקלתי בתקלה!" + "\n" + "נא נסו שנית בזמן אחר..."
    );
  } finally {
    res.type("text/xml").send(whatsappResponse.toString());
  }
});

app.listen(8080, () => {
  console.log("App listening on port 8080");

  const { query } = makeConnection();

  // will be `setInterval` in production
  const interval = setTimeout(async () => {
    try {
      if (!(accountSid && authToken && twilioNumber))
        throw new Error("You are missing a necessary environment variable.");

      const todaysVictimsQuery = await query({
        sql: `
      SELECT u.user_phone AS victimPhone, b.content AS messageContent, me.user_name AS betterName
      FROM bet AS b
      LEFT JOIN user AS u
      ON u.user_id = b.victim_id
      LEFT JOIN user AS me
      ON me.user_id = b.better_id
      WHERE b.occurs_on = CURDATE();
    `,
      });

      if (!(todaysVictimsQuery instanceof Array))
        throw new Error(
          "Received a query result that isn't an array - what the fuck."
        );

      const client = new Twilio(accountSid, authToken);

      if (!todaysVictimsQuery.length) console.log("No victims today.");
      else console.log("There are victims today!");

      todaysVictimsQuery.forEach(async (victim: VictimDetails) => {
        const message = await client.messages.create({
          from: twilioNumber,
          to: victim.victimPhone,
          body:
            "נשלח לך מ: " +
            victim.betterName +
            "\nאמרתי לך ש:\n\n" +
            victim.messageContent,
        });
        console.log(message.toJSON());
      });
    } catch (error) {
      console.log("interval error: ", error);
      clearInterval(interval);
    }
  }, 3000);
  // 86400000 -> milliseconds in a day
});

/* Modules */
const https = require("https");

/* Global variables */
const ACCESS_PASSWORD = process.env.ACCESS_PASSWORD;
const BOT_TOKEN = process.env.BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}/`;

/* Private functions */
const getTelegramURL = (resourceName, text, chatId) => {
  return `${TELEGRAM_API}${resourceName}?text=${text}&chat_id=${chatId}`;
};

const sendMessage = async (chatId, message) => {
  let responseMessage;

  if (!message)
    responseMessage = "I'm not able to understand messages without text :(";
  else if (!message.includes(`pass:${ACCESS_PASSWORD}`))
    responseMessage = "You need to provide access password :/";
  else
    responseMessage = message
      .replace(`pass:${ACCESS_PASSWORD}`, "")
      .includes("hello")
      ? "Hi Marcial! Welcome again to your bot :)"
      : "I'm not able to do that right now :(";

  let statusCode;
  await new Promise(function (resolve, reject) {
    https
      .get(getTelegramURL("sendMessage", responseMessage, chatId), (res) => {
        statusCode = res.statusCode;
        resolve(statusCode);
      })
      .on("error", (e) => {
        reject(Error(e));
      });
  });

  return statusCode;
};

exports.handler = async function (event, context) {
  console.log(`Event received: ${JSON.stringify(event)}`);
  const body = JSON.parse(event.body);
  const chatId = body.message?.chat?.id;
  const message = body.message?.text;

  await sendMessage(chatId, message);

  return { statusCode: 200 };
};

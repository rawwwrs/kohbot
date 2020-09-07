import { config } from "dotenv";
config();

import tmi, { ChatUserstate } from "tmi.js";

import { addCommand, editCommand } from "./commands";

const twitchChannel = process.env.CHANNEL || "rawrsatbeards";

const client = tmi.Client({
  // options: { debug: true },
  connection: {
    secure: true,
    reconnect: true,
  },
  identity: {
    username: process.env.BOT_NAME,
    password: `oauth:${process.env.BOT_OATH}`,
  },
  channels: [twitchChannel],
});

client.connect();

client.on(
  "message",
  (channel: string, tags: ChatUserstate, message: string, self) => {
    console.log(`${tags["display-name"]}: ${message}`);

    if (self || !message.startsWith("!")) return;
    message;

    if (message.toLowerCase() === "!koh") {
      client.say(
        channel,
        `@${tags.username}, follow me 👉👉👉 https://instagram.com/kohthebordercollie`
      );
    }

    if (message.toLowerCase() === "!rawr") {
      client.say(
        channel,
        `@${tags.username}, 'rawr' is dinosaur for "I LOVE YOU!"`
      );
    }

    if (message.toLowerCase() === "!bark") {
      client.say(channel, `@${tags.username}, [insert bark here]!`);
    }

    //TODO: extract this into the commands.ts file
    // Mod and broadcaster only
    if (tags.username === twitchChannel || tags.mod) {
      if (message.toLowerCase().startsWith("!command")) {
        const commandMessage: {
          type: string;
          name: string;
          response: string;
        } = message.split(" ").reduce(
          (acc, curr, i) => {
            if (i === 0) {
              return {
                ...acc,
                type: curr,
              };
            }
            if (i === 1) {
              return { ...acc, name: curr };
            }
            return {
              ...acc,
              response: acc?.response ? acc.response + " " + curr : curr,
            };
          },
          { type: "", name: "", response: "" }
        );

        switch (commandMessage.name) {
          case "add":
            addCommand(
              client,
              channel,
              commandMessage.name,
              commandMessage.response
            );
            return;
          case "edit":
            return editCommand(
              client,
              channel,
              commandMessage.name,
              commandMessage.response
            );
          // case "delete":
          // return;
          default:
            return;
        }
      }
    }
  }
);

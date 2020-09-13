import { config } from "dotenv";
config();

import tmi, { ChatUserstate } from "tmi.js";
import mongoose from "mongoose";

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

// TODO: fix fdgt (look at whitep4nth3r's code - STEAL ITs)
// const fdgt = tmi.Client({
//   connection: {
//     // The secure config is required if you're using tmi on the server.
//     // Node doesn't handle automatically upgrading .dev domains to use TLS.
//     secure: true,
//     server: "irc.fdgt.dev",
//   },
//   identity: {
//     username: process.env.BOT_NAME,
//     password: `oauth:${process.env.BOT_OATH}`,
//   },
//   channels: [twitchChannel],
// });

// fdgt.connect();
// fdgt.say(twitchChannel, "bits");

mongoose.connect("mongodb://localhost:27017/kohbot", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  authSource: "kohbot",
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Database connected");
});

// TODO:  FIND A RAID RESPONSE - MAYBE GET KOH INVOLVED!
client.on("raided", (_channel: string, username: string, _viewers: number) => {
  // Do your stuff.
  console.log(`I WAS RAIDED BY ${username}`);
});

client.on(
  "message",
  (channel: string, tags: ChatUserstate, message: string, self) => {
    console.log("\x1b[36m%s\x1b[0m", `${tags["display-name"]}: ${message}`);

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

    interface commandMessageInterface {
      type?: string;
      name?: string;
      response?: string;
    }

    //TODO: extract this into the commands.ts file
    // Mod and broadcaster only
    if (tags.username === twitchChannel || tags.mod) {
      if (message.toLowerCase().startsWith("!command")) {
        const commandMessage: commandMessageInterface = message
          .split(" ")
          .reduce((acc, curr, i) => {
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
          }, {} as commandMessageInterface);

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

import dotenv from "dotenv";
import { ChatUserstate } from "tmi.js";
import { addCommand, editCommand, runCommand } from "./lib/Actions/commands";
import Database from "./lib/Data/Database";
// import Fdgt from "./lib/Fdgt";
import Command from "./lib/Data/Command";
import Twitch from "./lib/Twitch";

dotenv.config();

Database.connect();
Command.initialize();

const client = Twitch.connect();
// Fdgt.connect();

const twitchChannel = process.env.CHANNEL || "rawrsatbeards";

// TODO:  FIND A RAID RESPONSE - MAYBE GET KOH INVOLVED!
client.on("raided", (_channel: string, username: string, _viewers: number) => {
  console.log(`I WAS RAIDED BY ${username}`);
});

client.on(
  "message",
  (channel: string, tags: ChatUserstate, message: string, self) => {
    console.log("\x1b[36m%s\x1b[0m", `${tags["display-name"]}: ${message}`);

    if (self || !message.startsWith("!")) return;
    message;

    // if (message.toLowerCase() === "!koh") {
    //   client.say(
    //     channel,
    //     `@${tags.username}, follow me 👉👉👉 https://instagram.com/kohthebordercollie`
    //   );
    // }

    // if (message.toLowerCase() === "!rawr") {
    //   client.say(
    //     channel,
    //     `@${tags.username}, 'rawr' is dinosaur for "I LOVE YOU!"`
    //   );
    // }

    // if (message.toLowerCase() === "!bark") {
    //   client.say(channel, `@${tags.username}, [insert bark here]!`);
    // }

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

    runCommand(
      client,
      channel,
      message.toLowerCase().split(" ")[0].replace("!", ""),
      tags?.username
    );
  }
);

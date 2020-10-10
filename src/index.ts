import dotenv from "dotenv";
import { ChatUserstate } from "tmi.js";
import { modCommand, runCommand } from "./lib/Actions/commands";
import Database from "./lib/Data/Database";
// import Fdgt from "./lib/Fdgt";
import Command from "./lib/Data/Command";
import Twitch from "./lib/Twitch";

dotenv.config();

Database.connect();
Command.initialize();

const client = Twitch.connect();
// Fdgt.connect();

// TODO:  FIND A RAID RESPONSE - MAYBE GET KOH INVOLVED!
client.on("raided", (_channel: string, username: string, _viewers: number) => {
  console.log(`I WAS RAIDED BY ${username}`);
});

client.on(
  "message",
  (channel: string, tags: ChatUserstate, message: string, self) => {
    console.log("\x1b[36m%s\x1b[0m", `${tags["display-name"]}: ${message}`);

    if (self || !message.startsWith("!")) return;

    modCommand(tags, message, client, channel);

    runCommand(
      client,
      channel,
      message.toLowerCase().split(" ")[0].replace("!", ""),
      tags?.username
    );
  }
);

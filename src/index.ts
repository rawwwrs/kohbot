import dotenv from "dotenv";
import express from "express";
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
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.get("/", (_, res) => {
  res.send("<h1>Hello Koh</h1>");
});

http.listen(process.env.PORT, () => {
  console.log(`***EXPRESS SERVER LISTENING ON PORT ${process.env.PORT}`);
});

io.on("connection", () => {
  console.log(`***SOCKET IS CONNECTED`);
  io.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// TODO:  FIND A RAID RESPONSE - MAYBE GET KOH INVOLVED!
client.on("raided", (_channel: string, username: string, _viewers: number) => {
  console.log(`I WAS RAIDED BY ${username}`);
});

client.on(
  "message",
  (channel: string, tags: ChatUserstate, message: string, self) => {
    const excludedUsers = ["135204446"];
    if (tags["user-id"] && !excludedUsers.includes(tags["user-id"])) {
      console.log("\x1b[36m%s\x1b[0m", `${tags["display-name"]}: ${message}`);
      io.emit("message", { tags, message });
    }

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

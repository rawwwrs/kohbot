import tmi, { Client } from "tmi.js";

const twitchChannel = process.env.CHANNEL || "rawrsatbeards";

const connect = (): Client => {
  const client = tmi.Client({
    options: { debug: !!(process.env.NODE_ENV === "development") },
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
  return client;
};

export default { connect };

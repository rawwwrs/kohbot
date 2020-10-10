import tmi from "tmi.js";

const twitchChannel = process.env.CHANNEL || "rawrsatbeards";

const connect = async () => {
  const client = tmi.Client({
    options: { debug: !!(process.env.NODE_ENV === "development") },
    connection: {
      // The secure config is required if you're using tmi on the server.
      // Node doesn't handle automatically upgrading .dev domains to use TLS.
      secure: true,
      server: "irc.fdgt.dev",
    },
    identity: {
      username: process.env.BOT_NAME,
      password: `oauth:${process.env.BOT_OATH}`,
    },
    channels: [twitchChannel],
  });
  await client.connect();
  setTimeout(() => {
    client.say(
      twitchChannel,
      "raid --username kohthebordercollie --viewercount 10000"
    );
  }, 5000);
};

export default { connect };

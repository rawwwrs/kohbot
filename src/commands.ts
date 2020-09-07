// NIGHTBOT FEATURES I WANT
// I want to be able to add, edit, delete and rollback commands
// I would like to add a counter (eventually)

import { Client } from "tmi.js";

export const addCommand = (
  client: Client,
  channel: string,
  command: string,
  response: string
): void => {
  client.say(channel, `${command}`);
  client.say(channel, `${response}`);
};

export const editCommand = (
  client: Client,
  channel: string,
  command: string,
  response: string
): void => {
  client.say(channel, `${command}`);
  client.say(channel, `${response}`);
};

// NIGHTBOT FEATURES I WANT
// I want to be able to add, edit, delete and rollback commands
// I would like to add a counter (eventually)

import { Client } from "tmi.js";
import Command from "../Data/Command";

export const addCommand = (
  client: Client,
  channel: string,
  response?: string
): void => {
  if (!response) return;
  // TODO: WIP, need to handle errors properly.
  // Will think about this later.
  let newResponse: string[] | string = response.split(" ");
  const name = newResponse.shift();
  newResponse = newResponse.join(" ");

  if (!name) return;

  Command.add({ name, response: newResponse })
    .then((res) => client.say(channel, res))
    .catch((error) => console.warn("error in addCommand", error));

  return;
};

export const editCommand = (
  client: Client,
  channel: string,
  command: string,
  response?: string
): void => {
  //TODO: Link to DB to edit commands.
  if (!response) return;

  Command.edit({ name: command, response })
    .then((res) => client.say(channel, res))
    .catch((error) => console.warn("error in editCommand", error));

  return;
};

export const deleteCommand = (
  client: Client,
  channel: string,
  command: string,
  response?: string
): void => {
  //TODO: Link to DB to delete commands.
  if (!response) return;

  Command.delete({ name: command, response })
    .then((res) => client.say(channel, res))
    .catch((error) => console.warn("error in deleteCommand", error));

  return;
};

export const runCommand = (
  client: Client,
  channel: string,
  command: string,
  username?: string
): void => {
  if (!username) return;

  Command.check(command)
    .then((res) => {
      if (res) {
        client.say(channel, res?.response?.replace("@USER", `@${username}`));
      }
    })
    .catch((error) => console.warn("error in runCommand", error));

  return;
};

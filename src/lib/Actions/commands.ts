// NIGHTBOT FEATURES I WANT
// I want to be able to add, edit, delete and rollback commands
// I would like to add a counter (eventually)

import { Client } from "tmi.js";
import Command from "../Data/Command";

const getCommandFromResponse = (response?: string) => {
  if (!response) return;
  let newResponse: string[] | string = response.split(" ");
  const name = newResponse.shift();
  newResponse = newResponse.join(" ");
  if (!name) return;
  return {
    name,
    response: newResponse,
  };
};

export const addCommand = (
  client: Client,
  channel: string,
  response?: string
): void => {
  const res = getCommandFromResponse(response);

  if (!res) return;

  Command.add(res)
    .then((res) => client.say(channel, res))
    .catch((error) => console.warn("error in addCommand", error));

  return;
};

export const editCommand = (
  client: Client,
  channel: string,
  response?: string
): void => {
  //TODO: Link to DB to edit commands.
  const res = getCommandFromResponse(response);

  if (!res) return;

  Command.edit(res)
    .then((res) => client.say(channel, res))
    .catch((error) => console.warn("error in editCommand", error));

  return;
};

export const deleteCommand = (
  client: Client,
  channel: string,
  response?: string
): void => {
  //TODO: Link to DB to delete commands.
  const res = getCommandFromResponse(response);
  if (!res) return;

  Command.delete(res)
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

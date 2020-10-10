// NIGHTBOT FEATURES I WANT
// I want to be able to add, edit, delete and rollback commands
// I would like to add a counter (eventually)

import { ChatUserstate, Client } from "tmi.js";
import Command from "../Data/Command";

interface commandMessageInterface {
  type?: string;
  name?: string;
  response?: string;
}

const twitchChannel = process.env.CHANNEL || "rawrsatbeards";

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

export const modCommand = (
  tags: ChatUserstate,
  message: string,
  client: Client,
  channel: string
) => {
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
          return addCommand(client, channel, commandMessage.response);
        case "edit":
          return editCommand(client, channel, commandMessage.response);
        case "delete":
          return deleteCommand(client, channel, commandMessage.response);
        default:
          return;
      }
    }
  }
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

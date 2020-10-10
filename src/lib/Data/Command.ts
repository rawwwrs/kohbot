import CommandModel from "../../models/CommandModel";

// export interface CommandProperties {
//   intialize: () => void;
//   check: () => undefined;
//   add: () => string;
//   edit: () => string;
//   delete: () => string;
// }

export default class Command {
  static initialize() {
    Command.add({
      name: "koh",
      response:
        "@USER, follow me 👉👉👉 https://instagram.com/kohthebordercollie",
    });
    Command.add({
      name: "rawr",
      response: `@USER, "rawr" is dinosaur for "I LOVE YOU!"`,
    });
    Command.add({
      name: "bark",
      response: `@USER,  [insert bark here]!`,
    });
  }

  static async check(
    name: string
  ): Promise<{ name: string; response: string } | null> {
    const checkCommand = await CommandModel.findOne({ name });

    if (checkCommand) return checkCommand;

    return null;
  }

  static async add(command: {
    name: string;
    response: string;
  }): Promise<string> {
    const checkCommand = await Command.check(command.name);
    if (checkCommand) return `${checkCommand.name} already exists`;

    const createCommand = await CommandModel.create(command);
    return createCommand.name;
  }

  static async edit(command: {
    name: string;
    response: string;
  }): Promise<string> {
    const checkCommand = Command.check(command.name);
    if (checkCommand) return `${command.name} command already exists`;

    const createCommand = await CommandModel.findOneAndUpdate(
      { name: command.name },
      { response: command.response },
      { new: true }
    );

    if (!createCommand) return `${command.name} doesn't exist`;
    return `${command.name} command updated`;
  }

  static async delete(command: {
    name: string;
    response: string;
  }): Promise<string> {
    const checkCommand = Command.check(command.name);
    if (!checkCommand) return `${command.name} command doesn't exist`;

    const deleteCommand = await CommandModel.findOneAndDelete({
      name: command.name,
    });

    if (!deleteCommand) return `${command.name} command not deleted`;
    return `${command.name} command deleted`;
  }
}

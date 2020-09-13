import CommandModel from "../models/CommandModel";

export default class Command {
  static async check(name: string): Promise<string | undefined> {
    const checkCommand = await CommandModel.findOne({ name });

    if (checkCommand) return "command already exists";

    return undefined;
  }

  static async add(command: {
    name: string;
    response: string;
  }): Promise<string> {
    const checkCommand = await Command.check(command.name);
    if (checkCommand) return checkCommand;

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

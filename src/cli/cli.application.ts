import { CommandParser } from './command-parser.js';
import { CliCommand } from './commands/cli-command.interface.js';

export class CliApplication {
  private commands: Record<string, CliCommand> = {};

  public registerCommand(command: CliCommand): void {
    if (this.commands[command.name]) {
      throw new Error(`The command with name ${command.name} has already been registered`);
    }

    this.commands[command.name] = command;
  }

  public processCommand(argv: string[]): void {
    const parsedCommand = CommandParser.parse(argv);
    const [command] = Object.keys(parsedCommand);

    if (!command) {
      throw new Error(`Command could not be parsed`);
    }

    if (!this.commands[command]) {
      throw new Error(`The command with name ${command} is not registered`);
    }

    this.commands[command].execute(...parsedCommand[command]);
  }
}

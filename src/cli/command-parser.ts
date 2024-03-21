type ParsedCommand = Record<string, string[]>;

export class CommandParser {
  public static parse(argv: string[]): ParsedCommand {
    const parsedCommand: ParsedCommand = {};
    let currentCommand: string;

    for (const argument of argv) {
      if (argument.startsWith('--')) {
        parsedCommand[argument] = [];
        currentCommand = argument;
      } else if (currentCommand && parsedCommand[currentCommand]) {
        parsedCommand[currentCommand].push(argument);
      }
    }

    return parsedCommand;
  }
}

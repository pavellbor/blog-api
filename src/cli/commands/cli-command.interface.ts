export interface CliCommand {
  name: string;
  execute: (...args: string[]) => void;
}

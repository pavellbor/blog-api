import 'reflect-metadata';
import { CliApplication, ImportCommand } from './cli/index.js';

function bootstrap() {
  const cliApplication = new CliApplication();

  cliApplication.registerCommand(new ImportCommand());

  cliApplication.processCommand(process.argv);
}

bootstrap();

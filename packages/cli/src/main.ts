import { program } from 'commander';

program
  .name('beyondlint')
  .description('A rule-engine for triggering actions based on code changes')
  .version('1.0.0');

program
  .option('--ci', 'CI Mode (will trigger actions)', 'false')
  .option('--config <path>', 'Path to the configuration file')
  .action((options) => {
    const {
      config,
      ci,
    } = options;
    console.log(`Configuration file path: ${config}`);
    console.log(`CI Mode: ${ci}`);
  });

program.parse(process.argv); 

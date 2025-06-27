import { program } from 'commander';
import { dependencyAddedRule } from '@beyondlint/rules';

program
  .name('beyondlint')
  .description('A rule-engine for triggering actions based on code changes')
  .version('1.0.0');

program
  .option('--ci', 'CI Mode (will trigger actions)', 'false')
  .option('--config <path>', 'Path to the configuration file')
  .action(async (options) => {
    const {
      config,
      ci,
    } = options;
    console.log(`Configuration file path: ${config}`);
    console.log(`CI Mode: ${ci}`);

    await dependencyAddedRule(
      'packages/cli',
      ['@beyondlint/abc'],
    );
  });

program.parse(process.argv); 

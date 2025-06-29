import { program } from 'commander';
import { dependencyAddedRule } from '@beyondlint/rules';
import { findAllProjectConfigs } from '@beyondlint/core';

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

    const projectConfigs = findAllProjectConfigs();

    console.log('Project Configs:', projectConfigs);

    await dependencyAddedRule(
      'packages/cli',
      ['@beyondlint/abc'],
    {
      base: 'b21e8019ed34641b337113b1861a048f75708267',
      head: '745e0ba74b466fadfd05da984d600a2e6b21fa80',
    }
    );
  });

program.parse(process.argv); 

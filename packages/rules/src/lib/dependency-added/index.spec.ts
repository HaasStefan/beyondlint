import { rmSync } from 'node:fs';
import { dependencyAddedRule } from './index.js';
import { setupMockConfigFiles } from '@beyondlint/core/testing';

describe('Dependency Added Rule', () => {
  const tempFolder = 'tmp/rules/src/lib/dependency-added';

  beforeEach(() => {
    setupMockConfigFiles(tempFolder, {
      baseConfig: {
        gitOptions: {
          base: 'bd8f28e5bcf845f6dc24adb64fa46e6e12c69bdb',
          head: '90dca4da07673425888b05452852c731a2eea22f',
        }
      }
    });
  });

  afterEach(() => {
    // Clean up the temporary folder after each test
    rmSync(tempFolder, { recursive: true, force: true });
  });
  it('should detect added dependencies', async () => {
     const result = await dependencyAddedRule(
      'packages/core',
      ['@beyondlint/abc']
    );

    console.log('Rule result:', result);
    expect(result).toBeDefined();
  });

});
declare module 'eslint-plugin-cypress' {
  export const cypress: {
    rules: {
      'cypress/no-assigning-return-values': 'error' | 'warn';
      'cypress/unsafe-to-chain-command': 'error' | 'warn';
      'cypress/no-unnecessary-waiting': 'error' | 'warn';
      'cypress/no-async-before': 'error' | 'warn';
      'cypress/no-async-tests': 'error' | 'warn';
      'cypress/assertion-before-screenshot': 'error' | 'warn';
      'cypress/require-data-selectors': 'error' | 'warn';
      'cypress/no-force': 'error' | 'warn';
      'cypress/no-pause': 'error' | 'warn';
    };
    configs: {
      recommended: {
        plugins: string[];
        env: Record<string, any>;
        rules: {
          'cypress/no-assigning-return-values': 'error';
          'cypress/no-unnecessary-waiting': 'error';
          'cypress/no-async-tests': 'error';
          'cypress/unsafe-to-chain-command': 'error';
        };
      };
    };
  };

  // eslint-disable-next-line import/no-default-export
  export default cypress;
}

declare module 'eslint-plugin-storybook' {
  import { StorybookRules } from './rules/storybook';

  const storybook = {
    rules: StorybookRules,
  };

  // eslint-disable-next-line import/no-default-export
  export default storybook;
}

# TODOs

- Migrate from React PureComponents to hooks
- ESLint
  - Add `eslint-plugin-jsx-a11y` and `eslint-plugin-import` to ESLint config
  - [`Warning: React version not specified in eslint-plugin-react settings.`](https://github.com/jsx-eslint/eslint-plugin-react#configuration)
  - Allow Prettier to format Markdown and YAML files with the correct tab spacing of 2
  - Migrate Prettier config to ESLint
  - When it becomes stable, use the equivalent of the current
    `--flag unstable_config_lookup_from_file` command-line argument
    instead of `-c` to dynamically resolve the config file. See more at:
    [feature flags](https://eslint.org/docs/latest/flags#flag-prefixes)
- Add ESLint/Prettier Git CI integration
- Remove unused Babel dependencies
- Configure .hintrc
- Add tests with Playwright for Node.js

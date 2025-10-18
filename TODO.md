# TODOs

- ESLint
  - Add `eslint-plugin-jsx-a11y` and `eslint-plugin-import` to ESLint config
  - When it's released in `eslint@^10`, use the equivalent of the current
    `--flag v10_config_lookup_from_file` command-line argument
    instead of `-c` to dynamically resolve the config file. See more at:
    [feature flags](https://eslint.org/docs/latest/flags#flag-prefixes)
- Add ESLint/Prettier Git CI integration
- Remove unused Babel dependencies
- Configure .hintrc
- Add tests with Playwright for Node.js
- Migrate from webpack and `webpack-dev-server` to Next.js

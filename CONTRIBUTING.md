# Contributing to Affinidi CLI

## Getting started

Clone the repository and run `npm install` command.

Some useful commands:

- Use `npm run dev` to run the CLI locally.
  > To execute commands, prefix them with `npm run dev` (and ommit the `affinidi` name).
  > Check out the in-depth instructions in the [CLI ReadMe](README.md) file for using existing commands.
- Run `npm test` to execute unit tests
  > You can find them in the `src/test/unit-tests` directory.
  <!-- - Run `npm run test:integration` to execute integration tests
    > You can find them in the `src/test/integration-test` directory. -->
- `npm run lint` can be used to check for linting errors

## Implementing a new command

We built the Affinidi CLI with the [Open CLI Framework](https://oclif.io/). We followed their patterns when implementing commands. Please see their [documentation](https://oclif.io/docs/introduction) for a deeper understanding.  
If you want to implement a new command, you must include an appropriately named file in the `src/commands/` directory. You can also add subcommands by using a nested folder structure.

As an example, let's say you want to add an `auth` command with two subcommands: `get` and `set`.

1. Create `src/commands/auth/` directory
2. Add your main command logic to `src/commands/auth/index.ts`, and the logic for the subcommands `get` and `set` in their respective files:

```src/
└── commands/
    └── auth/
        ├── index.ts
        ├── set.ts
        └── get.ts
```

For simple commands, you can also take advantage of OCLIF's [command generation tool](https://oclif.io/docs/generator_commands#oclif-generate-command-name) directly in the terminal, which will scaffold a single command file in the `src/commands/` directory and a test file in `src/test/commands/` directory. Please move the created test file to the `src/test/unit-tests/commands/` directory and delete the new `src/test/commands/` directory in order to comply with this repo's test structure.

## Analytics & telemetry

In order to send an analytics event, use the `eventsControllerSend()` method:

```ts
import { analyticsService } from 'src/services/analytics'
import { EventDTO } from '../services/analytics/analytics.api'

// ...
const analyticsData: EventDTO = {
  name: 'EXAMPLE_EVENT',
  category: 'APPLICATION',
  component: 'Cli',
  uuid: configService.getCurrentUser(),
  metadata: {
    commandId: 'affinidi.example-command',
    ...generateUserMetadata(account.label),
  },
}
await analyticsService.eventsControllerSend(analyticsData)
```

## Messages

We store messages to the user (welcome, prompts, errors, etc.) in different places:

1. For brief messages, we inline them in the command file.
2. We store more complex user interactions in the `src/user-actions/` directory. For prompts, we use OCLIF's native [tool](https://oclif.io/docs/prompting) and store them in `src/user-actions/prompts.ts` as well as the [Inquirer library](https://www.npmjs.com/package/inquirer), which we store in `src/user-actions/inquirer.ts`.
3. Longer messages and general command errors as well as some message-building logic are stored in the `src/render/` directory.

We use [Chalk](https://www.npmjs.com/package/chalk) to style messages in the terminal.

## Configuration & credentials

CLI Configurations are stored in the `~/.affinidi/config.json` file.  
This file persists even after user log out.

Credentials and other sensitive data are stored in the `~/.affinidi/credentials.json` file.  
This file is removed after user log out.

You can access the data in these files by using `src/services/vault`:

```ts
import { vaultService } from './services/vault/typedVaultService'

// ...

const activeProject = vaultService.getActiveProject()
const apiKeyhash = activeProject.apiKey.apiKeyHash
console.log(apiKeyhash)
```

## Github repository & pull requests

Please follow semantic release conventions for your commits and pull request names.  
Read about it here: https://github.com/semantic-release/semantic-release

For example, a correct commit name or pull request name is: `fix: add test` or `feat: implement a tree view`

Don't forget to write a meaningful description to your pull request.  
If necessary, attach a screenshot of UI changes.

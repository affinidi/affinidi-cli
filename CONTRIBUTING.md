# Contributing to Affinidi CLI

[[_TOC_]]

Before you start contributing please read the CLI's [#philosophy](#philosophy) and [#guidelines](#guidelines). There you will find important information on how to design and structure your commands, flags, outputs, errors, help texts, prompts and more

## Getting Started

- Run `npm install` to install dependencies
- Run `npm test` to execute tests
- Run `npm run lint` to check for linting errors

To run commands in development mode use `./bin/dev [command]`

To run commands in production mode first build the project with `npm run build` and then use `./bin/run [command]`.

You can also link the production build to your path with `npm link` and then you can run `affinidi [command]`.

### Implementing a new command

Affinidi CLI is built with the [Open CLI Framework (oclif)](https://oclif.io/). It follows their patterns when implementing commands. Please see their [documentation](https://oclif.io/docs/introduction) for a deeper understanding.

If you want to implement a new command, you must include an appropriately named file in the `src/commands/` directory. You can also add subcommands by using a nested folder structure.

As an example, let's say you want to add an `auth` command with two subcommands: `get` and `set`:

1. Create `src/commands/auth/` directory
2. Add your main command logic to `src/commands/auth/index.ts`, and the logic for the subcommands `get` and `set` in their respective files:

```src/
└── commands/
    └── auth/
        ├── set.ts
        └── get.ts
```

For simple commands, you can also take advantage of oclif's [command generation tool](https://oclif.io/docs/generator_commands#oclif-generate-command-name) directly in the terminal, which will scaffold a single command file in the `src/commands/` directory and a test file in `test/commands/` directory.

#### Updating README

Another oclif's handy tool alows to update README.md with all the documentation of newly added command. To do this run

```bash
npm run generate:readme
```

Read more here: https://github.com/oclif/oclif#oclif-readme

### Testing

Tests in the CLI use Oclif's default testing framework of [mocha](https://mochajs.org) and [fancy-test](https://github.com/oclif/fancy-test).

Add your tests to `./test`. External integrations like API calls should be mocked.

Run unit tests with:

```bash
npm run test
```

Read more here: https://oclif.io/docs/testing

### Messages

For prompting use [Inquirer](https://www.npmjs.com/package/inquirer).

Use [Chalk](https://www.npmjs.com/package/chalk) to style messages in the terminal.

### Github repository & pull requests

Please follow semantic release conventions for your commits and pull request names. Read about it here: https://github.com/semantic-release/semantic-release

For example, a correct commit name or pull request name is: `fix: add test` or `feat: implement a tree view`

Don't forget to write a meaningful description to your pull request. If necessary, attach a screenshot of UI changes.

## Philosophy

- **Human-first design:** CLI is going to be used primarily by humans. Design it for them first, and for machines second.

- **Simple parts that work together:** Make it modular and composable, with standards that make the pieces work together nicely. Embrace the different ways it may be used.

- **Consistency across programs:** CLI should be intuitive, guessable and efficient. Where possible, follow existing patterns.

- **Saying (just) enough:** Provide enough feedback to avoid confusion and frustration, without overwhelming the user with too much information.

- **Ease of discovery:** Offer comprehensive help texts, provide examples, suggest follow-up commands, and assist with error handling.

- **Conversations and Empathy:** Acknowledge the conversational nature. Suggest corrections, provide clarity during multi-step processes, ask for confirmation. Make the conversation empathetic and enjoyable.

- **Robustness:** Make it _feel_ robust. Take attention to detail, address potential issues, keep user informed, avoid complexity.

## Guidelines

### Commands and Subcommands

Commands in Affinidi CLI have the following structure:

```console
$ affinidi <command> <subcommand> [flags and arguments]
```

Where:

- `affinidi` is the base program.

- `<command>` is the top level command. Corresponds to a domain and contains one or multiple subcommands. They are called `Topics` by oclif. There are some exceptions for global commands like `affinidi login`.

- `<subcommand>` is the specific operation to perform. When applicable use the `<verb>-<resource>` format. Use plurals when multiple resources are involved. Don't use ambiguous or similarly-named commands. Examples:

  - `get-config`
  - `list-users`
  - `put-policies`
  - `sign-credential`
  - `remove-user-from-group`
  - `update-connector`
  - `delete-group`
  - `create-seed`

- `[flags and arguments]` are the parameters required by the operation.

Commands should be single lowercase words. Subcommands and flags should also be lowercase, and when multiple words are required they should be in `kebab-case`.

### Output

Prioritize human-readable output over machine-readable. To not break machine integration, add flags like `--plain` and `--json` to specify the output format as plain tabular text or json respectively.

- Send the primary output to `stdout`. Don't display animations here.

- Send messaging like logs and errors to `stderr`. Don't display unnecessary contextual information here, unless in verbose mode.

- Return zero exit code on success, non-zero codes on failure.

- Display output on success, don't keep the user hanging.

- Communicate changes to the state.

- Communicate external actions like accessing files or remote servers.

- Use (but don't abuse) colors, symbols and emojis.

- Increase information density with ASCII art!

### Errors

- Catch errors and rewrite them for humans, with potential causes and suggestions.

- Increase signal to noise ratio. Show only the relevant information that will help the user figure out what's wrong.

### Flags and Arguments

- Strongly prefer flags over arguments. Don't expect the user to remember the ordering of arguments. If you wan't to use an argument you will need to properly justify it.

- Have full length descriptive names for all flags.

- Only use one-letter names for commonly used flags.

- Use standard and consistent names for flags. Follow existing patterns.

- Have sensible defaults for flags when possible.

- If input or output is a file, support `-` to read from `stdin` or write to `stdout`. This allows the output of another command to be the input of your command.

- Do not read secrets directly from flags. They will leak into `ps` output and shell history. Instead, only accept secrets via files or `stdin`.

Commonly used flags:

- `-a`, `--all`: All. For example, `ps`, `fetchmail`.
- `-d`, `--debug`: Show debugging output (verbose).
- `-f`, `--force`: Force. For example, `rm -f` will force the removal of files, even if it thinks it does not have permission to do it. This is also useful for commands which are doing something destructive that usually require user confirmation, but you want to force it to do that destructive action in a script.
- `--json`: Display JSON output. See the [output](#output) section.
- `-h`, `--help`: Help. This should only mean help. See the [help](#help) section.
- `--no-input`: See the [interactivity](#interactivity-and-prompting) section.
- `-o`, `--output`: Output file. For example, `sort`, `gcc`.
- `-p`, `--port`: Port. For example, `psql`, `ssh`.
- `-q`, `--quiet`: Quiet. Display less output. This is particularly useful when displaying output for humans that you might want to hide when running in a script.
- `-u`, `--user`: User. For example, `ps`, `ssh`.
- `-v`, `--version`: Version.

### Interactivity and prompting

- Create a reaction for every action. Responsiveness is more important than speed.

- Show progress visually, use a [spinner](https://oclif.io/docs/spinner) or a progress bar.

- Break long running tasks into meaningful steps.

- Make it easy to see the current state. Add state visualization commands like `git status`.

- If a user doesn't pass a required flag or argument, prompt for it.

- Never require prompting. Make sure to provide the required flags to bypass the prompt.

- Confirm before doing anything dangerous. Prompt the user to type `y` or `yes`, or require the `--force` flag.

- If you’re prompting for a secret, don’t print it as the user types it. Both `oclif` and `inquirer` have ways to hide them.

### Help

There should be two help texts:

- A concise help text when running a command or subcommand without any inputs. Can be skipped if the command has a default action, such as `affinidi login`. Should include:

  - Usage
  - Description of command
  - Example
  - Description of most commonly used flags
  - Instruction to pass the `--help` flag for more information

- A more detailed help text. Displayed with `--help` or `-h` flags. Always displayed, no matter what other flags are given.

  - Usage
  - Description of command
  - Examples
  - Description of all supported flags

### Future-proofing

Introducing breaking changes will require a lengthy deprecation process. Keep these changes to a minimum, especially those that affect machine integration.

- Keep changes additive. Prefer adding new flags than changing the behaviour of old ones.

- Warn users when they are using a deprecated command or flag.

- Changing output for humans is usually OK. Encourage the usage of machine flags like `--json` or `--quiet`.

### BFF

Affinidi CLI uses Backend For Frontend (BFF - backend service for the [Affinidi Dev Portal](https://portal.affinidi.com/)) for authentication and making proxy calls to other Affinidi services such as IAM and VPA.
Once user is authenticated, BFF stores user's auth tokens in a session and returns to CLI a sessionId, and CLI stores it as described [here](https://github.com/affinidi/affinidi-cli#session-and-configuration-files). That sessionId has to be passed to BFF on each request in headers.

BFF has middlewares that performs token management (including refreshing tokens) and gets project scoped token for proxied calls to IAM and VPA services.

Please refer to the implementation details (f.e. `affinidi login list-configs` command, [link to code](https://github.com/affinidi/affinidi-cli/blob/main/src/commands/login/list-configs.ts)) how the call is proxied to BFF.

---

> As we evolve the CLI tooling and introduce the SDK, we will provide updated guidelines on how to improve robustness, analytics, and usage of environnement variables and config files.

## Further reading and acknowledgments

These guidelines are strongly inspired by [clig.dev](https://clig.dev/), adjusted to Affinidi's needs and written specifically for CLI contributors. clig.dev is worth a read and we recommend doing so.

- https://uxdesign.cc/user-experience-clis-and-breaking-the-world-baed8709244f
- https://blog.developer.atlassian.com/10-design-principles-for-delightful-clis
- https://devcenter.heroku.com/articles/cli-style-guide

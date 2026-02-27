# Copilot Instructions for affinidi-cli

## Build, Test, and Lint

```bash
npm install          # install dependencies
npm run build        # compile TypeScript to dist/
npm run lint         # check lint errors
npm run lint:fix     # auto-fix lint errors
npm test             # run all tests
```

Run a single test file:
```bash
npx mocha "test/commands/login/config.test.ts"
```

Dev mode (no build needed):
```bash
./bin/dev.js <command>
```

Production mode:
```bash
npm run build && ./bin/run.js <command>
```

Regenerate `README.md` command docs after adding commands:
```bash
npm run generate:readme
```

## Architecture

This is an [oclif](https://oclif.io/)-based CLI (ESM, Node ≥ 20) that acts as a frontend for Affinidi's developer platform.

**Key layers:**

- `src/commands/` — One file per command, mirroring the CLI topic/subcommand hierarchy. Commands are auto-discovered from this directory by oclif.
- `src/common/` — Shared `BaseCommand`, constants, validators, prompts, and error message helpers.
- `src/services/affinidi/` — Service classes wrapping `@affinidi-tdk/*` API clients, all proxied through a BFF (Backend For Frontend).
- `src/services/credentials-vault.ts` — Stores the BFF session cookie in the OS keychain (via `keytar`), with a file-based fallback via `Conf`.
- `src/services/env-config.ts` — Environment selection (`AFFINIDI_CLI_ENVIRONMENT=local|dev|prod`), defaults to `prod`.

**Auth / BFF flow:**

1. `affinidi login` authenticates the user and stores a session ID (cookie) in the OS keychain.
2. All subsequent API calls attach the session cookie via `getBFFHeaders()` and route through the BFF (`config.bffHost`).
3. The BFF handles token refresh and forwards requests to downstream Affinidi services (IAM, VPA, etc.).

## Key Conventions

### Commands always extend `BaseCommand`

```ts
export class MyCommand extends BaseCommand<typeof MyCommand> {
  static summary = '...'
  static examples = ['<%= config.bin %> <%= command.id %>']

  public async run(): Promise<OutputType> {
    ux.action.start('...')
    const result = await someService.doSomething()
    ux.action.stop('Done!')
    if (!this.jsonEnabled()) this.logJson(result)
    return result
  }
}
```

`BaseCommand` automatically adds `--json`, `--no-color`, and `--no-input` flags to every command.

### Command naming

- Topics (top-level): `project`, `login`, `iam`, `iota`, `issuance`, `token`, `wallet`
- Subcommands use `<verb>-<resource>` kebab-case: e.g., `create-config`, `list-users`, `delete-group`

### Prompting pattern

Always check `flags['no-input']` before prompting. Use the shared helper:
```ts
import { promptRequiredParameters } from '../../common/prompts.js'
```
Or manually guard:
```ts
if (flags['no-input']) throw new CLIError(giveFlagInputErrorMessage('flag-name'))
const value = await input({ message: 'Enter value' })
```

### Input validation

Use Zod schemas. `BaseCommand.catch()` automatically formats `ZodError` into human-readable messages. Define schemas in the service layer and throw before calling APIs.

### Service layer pattern

Services are singleton instances wrapping `@affinidi-tdk/*` SDK clients. Always pass BFF headers:
```ts
const headers = await getBFFHeaders()
const baseOptions = { headers }
const basePath = `${config.bffHost}/vpa`
const client = new SomeApi(new Configuration({ basePath, baseOptions }))
```
Handle `AxiosError` with `handleServiceError()` from `src/services/affinidi/errors.ts`.

### Testing

Tests use `mocha` + `chai` + `nock` for HTTP mocking. Use `runCommand` from `@oclif/test`:
```ts
import { runCommand } from '@oclif/test'
import nock from 'nock'

nock(BASE_URL).get('/some/endpoint').reply(200, mockData)
const { stdout } = await runCommand(['topic subcommand', '--flag=value'])
const response = JSON.parse(stdout)
expect(response).to.have.property('id')
```
All external HTTP calls must be mocked with `nock`. Test files live in `test/commands/<topic>/`.

### Output

- Use `ux.action.start/stop` for spinners during async calls.
- Return the data object from `run()` (enables `--json` support automatically).
- Call `this.logJson(result)` for default human-readable output when `--json` is not active.

### Commits and PRs

Follow semantic release conventions: `feat: ...`, `fix: ...`, `chore: ...`, etc. These drive automated versioning and changelog generation.

`affinidi start`
================

Log in to Affinidi

* [`affinidi start`](#affinidi-start)

## `affinidi start`

Log in to Affinidi

```
USAGE
  $ affinidi start [--json] [--no-color] [--no-input] [-p affinidi|google|microsoft|apple|github|email]

FLAGS
  -p, --provider=<option>  Login provider to authenticate with
                           <options: affinidi|google|microsoft|apple|github|email>

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

EXAMPLES
  $ affinidi start

  $ affinidi start --provider github

  $ affinidi start --provider email

FLAG DESCRIPTIONS
  -p, --provider=affinidi|google|microsoft|apple|github|email  Login provider to authenticate with

    Use "email" to log in with a one-time code sent to your email. Prompts for a provider if omitted. With --no-input,
    defaults to Affinidi Vault.
```

_See code: [src/commands/start.ts](https://github.com/affinidi/affinidi-cli/blob/v2.15.0/src/commands/start.ts)_

`affinidi start`
================

Log in to Affinidi

* [`affinidi start`](#affinidi-start)

## `affinidi start`

Log in to Affinidi

```
USAGE
  $ affinidi start [--json] [--no-color] [--no-input] [-p affinidi|google|microsoft|apple|github]

FLAGS
  -p, --provider=<option>  Login provider to authenticate with
                           <options: affinidi|google|microsoft|apple|github>

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

EXAMPLES
  $ affinidi start

  $ affinidi start --provider github

FLAG DESCRIPTIONS
  -p, --provider=affinidi|google|microsoft|apple|github  Login provider to authenticate with

    If omitted, the default login page opens.
```

_See code: [src/commands/start.ts](https://github.com/affinidi/affinidi-cli/blob/v2.13.0/src/commands/start.ts)_

`affinidi whoami`
=================

Returns user's subject, projects, and token details from the current session.

* [`affinidi whoami`](#affinidi-whoami)

## `affinidi whoami`

Returns user's subject, projects, and token details from the current session.

```
USAGE
  $ affinidi whoami [--json] [--no-color] [--no-input]

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

EXAMPLES
  $ affinidi whoami
```

_See code: [src/commands/whoami.ts](https://github.com/affinidi/affinidi-cli/blob/v2.10.0/src/commands/whoami.ts)_

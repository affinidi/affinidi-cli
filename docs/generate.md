`affinidi generate`
===================

Use these commands to generate code to get started or to scaffold your solution

* [`affinidi generate app`](#affinidi-generate-app)

## `affinidi generate app`

Generates code samples that integrates Affinidi Login. Requires git

```
USAGE
  $ affinidi generate app [--json] [--no-color] [--no-input] [-a <value>] [-f
    <value>] [-l <value>] [-p <value>] [--force]

FLAGS
  -a, --provider=<value>   Authentication provider for the sample app
  -f, --framework=<value>  Framework for the sample app
  -l, --library=<value>    Library for the sample app
  -p, --path=<value>       Relative or absolute path where sample app should be cloned into
      --force              Override destination directory if exists

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

EXAMPLES
  $ affinidi generate app

  $ affinidi generate app -p "../my-app" -f django -a affinidi

  $ affinidi generate app --path "../my-app" --framework django --provider affinidi --force
```

_See code: [src/commands/generate/app.ts](https://github.com/affinidi/affinidi-cli/blob/v2.7.0/src/commands/generate/app.ts)_

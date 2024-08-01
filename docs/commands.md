`affinidi commands`
===================

List all affinidi commands.

* [`affinidi commands`](#affinidi-commands)

## `affinidi commands`

List all affinidi commands.

```
USAGE
  $ affinidi commands [--json] [-c id|plugin|summary|type... | --tree]
    [--deprecated] [-x | ] [--hidden] [--no-truncate | ] [--sort id|plugin|summary|type | ]

FLAGS
  -c, --columns=<option>...  Only show provided columns (comma-separated).
                             <options: id|plugin|summary|type>
  -x, --extended             Show extra columns.
      --deprecated           Show deprecated commands.
      --hidden               Show hidden commands.
      --no-truncate          Do not truncate output.
      --sort=<option>        [default: id] Property to sort by.
                             <options: id|plugin|summary|type>
      --tree                 Show tree of commands.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List all affinidi commands.
```

_See code: [@oclif/plugin-commands](https://github.com/oclif/plugin-commands/blob/v4.0.10/src/commands/commands.ts)_

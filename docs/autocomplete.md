`affinidi autocomplete`
=======================

Display autocomplete installation instructions.

* [`affinidi autocomplete [SHELL]`](#affinidi-autocomplete-shell)

## `affinidi autocomplete [SHELL]`

Display autocomplete installation instructions.

```
USAGE
  $ affinidi autocomplete [SHELL] [-r]

ARGUMENTS
  SHELL  (zsh|bash|powershell) Shell type

FLAGS
  -r, --refresh-cache  Refresh cache (ignores displaying instructions)

DESCRIPTION
  Display autocomplete installation instructions.

EXAMPLES
  $ affinidi autocomplete

  $ affinidi autocomplete bash

  $ affinidi autocomplete zsh

  $ affinidi autocomplete powershell

  $ affinidi autocomplete --refresh-cache
```

_See code: [@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v3.1.11/src/commands/autocomplete/index.ts)_

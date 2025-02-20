`affinidi iam`
==============

Use these commands to manage policies for access configuration

* [`affinidi iam add-principal`](#affinidi-iam-add-principal)
* [`affinidi iam get-policies`](#affinidi-iam-get-policies)
* [`affinidi iam list-principals`](#affinidi-iam-list-principals)
* [`affinidi iam remove-principal`](#affinidi-iam-remove-principal)
* [`affinidi iam update-policies`](#affinidi-iam-update-policies)

## `affinidi iam add-principal`

Adds a principal (user or token) to the active project

```
USAGE
  $ affinidi iam add-principal [--json] [--no-color] [--no-input] [-i <value>] [-t
    token|user]

FLAGS
  -i, --principal-id=<value>     ID of the principal
  -t, --principal-type=<option>  Type of the principal
                                 <options: token|user>

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

DESCRIPTION
  Adds a principal (user or token) to the active project

  To change your active project, use command affinidi project select-project

EXAMPLES
  $ affinidi iam add-principal -i <uuid>

  $ affinidi iam add-principal --principal-id <uuid> --principal-type token

FLAG DESCRIPTIONS
  -i, --principal-id=<value>  ID of the principal

    Get a list of possible IDs with command affinidi token list-tokens
```

_See code: [src/commands/iam/add-principal.ts](https://github.com/affinidi/affinidi-cli/blob/v2.13.0/src/commands/iam/add-principal.ts)_

## `affinidi iam get-policies`

Gets the policies of a principal (user or token)

```
USAGE
  $ affinidi iam get-policies [--json] [--no-color] [--no-input] [-i <value>] [-t
    token|user]

FLAGS
  -i, --principal-id=<value>     ID of the principal
  -t, --principal-type=<option>  Type of the principal
                                 <options: token|user>

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

DESCRIPTION
  Gets the policies of a principal (user or token)

  Make sure the principal you are working with is part of the active project
  Use command affinidi project select-project to change your active project

EXAMPLES
  $ affinidi iam get-policies -i <uuid>

  $ affinidi iam get-policies --principal-id <uuid> --principal-type token

FLAG DESCRIPTIONS
  -i, --principal-id=<value>  ID of the principal

    Get a list of possible IDs with command affinidi token list-tokens
```

_See code: [src/commands/iam/get-policies.ts](https://github.com/affinidi/affinidi-cli/blob/v2.13.0/src/commands/iam/get-policies.ts)_

## `affinidi iam list-principals`

Lists the principals (users and tokens) in the active project

```
USAGE
  $ affinidi iam list-principals [--json] [--no-color] [--no-input]

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

DESCRIPTION
  Lists the principals (users and tokens) in the active project

  To change your active project, use command affinidi project select-project

EXAMPLES
  $ affinidi iam list-principals
```

_See code: [src/commands/iam/list-principals.ts](https://github.com/affinidi/affinidi-cli/blob/v2.13.0/src/commands/iam/list-principals.ts)_

## `affinidi iam remove-principal`

Removes a principal (user or token) from the active project

```
USAGE
  $ affinidi iam remove-principal [--json] [--no-color] [--no-input] [-i <value>] [-t
    token|user]

FLAGS
  -i, --principal-id=<value>     ID of the principal
  -t, --principal-type=<option>  Type of the principal
                                 <options: token|user>

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

DESCRIPTION
  Removes a principal (user or token) from the active project

  To change your active project, use command affinidi project select-project

EXAMPLES
  $ affinidi iam remove-principal -i <uuid>

  $ affinidi iam remove-principal --principal-id <uuid> --principal-type token

FLAG DESCRIPTIONS
  -i, --principal-id=<value>  ID of the principal

    Get a list of possible IDs with command affinidi token list-tokens
```

_See code: [src/commands/iam/remove-principal.ts](https://github.com/affinidi/affinidi-cli/blob/v2.13.0/src/commands/iam/remove-principal.ts)_

## `affinidi iam update-policies`

Updates the policies of a principal (user or token) in the active project

```
USAGE
  $ affinidi iam update-policies [--json] [--no-color] [--no-input] [-i <value>] [-t
    token|user] [-f <value>]

FLAGS
  -f, --file=<value>             Location of a json file containing principal policies
  -i, --principal-id=<value>     ID of the principal
  -t, --principal-type=<option>  Type of the principal
                                 <options: token|user>

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

DESCRIPTION
  Updates the policies of a principal (user or token) in the active project

  Make sure the principal you are working with is part of the active project
  Use command affinidi project select-project to change your active project

EXAMPLES
  $ affinidi iam update-policies -i <uuid>

  $ affinidi iam update-policies --principal-id <uuid> --principal-type token --file policies.json

FLAG DESCRIPTIONS
  -i, --principal-id=<value>  ID of the principal

    Get a list of possible IDs with command affinidi token list-tokens
```

_See code: [src/commands/iam/update-policies.ts](https://github.com/affinidi/affinidi-cli/blob/v2.13.0/src/commands/iam/update-policies.ts)_

`affinidi issuance`
===================

Use these commands to manage credential issuance configurations

* [`affinidi issuance create-config`](#affinidi-issuance-create-config)
* [`affinidi issuance delete-config`](#affinidi-issuance-delete-config)
* [`affinidi issuance get-config`](#affinidi-issuance-get-config)
* [`affinidi issuance list-configs`](#affinidi-issuance-list-configs)
* [`affinidi issuance update-config`](#affinidi-issuance-update-config)

## `affinidi issuance create-config`

Creates credential issuance configuration in your active project

```
USAGE
  $ affinidi issuance create-config [--json] [--no-color] [--no-input] [-n <value>] [-d
    <value>] [-w <value>] [--credential-offer-duration <value>] [-f <value>]

FLAGS
  -d, --description=<value>                Description of the credential issuance configuration
  -f, --file=<value>                       Location of a json file containing the list of allowed schemas for creating a
                                           credential offer. One or more schemas can be added to the issuance. The
                                           credential type ID must be unique
  -n, --name=<value>                       Name of the credential issuance configuration
  -w, --wallet-id=<value>                  ID of the wallet
      --credential-offer-duration=<value>  Credential offer duration in seconds

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

EXAMPLES
  $ affinidi issuance create-config -n <value> -w <value> -f credentialSchemas.json

  $ affinidi issuance create-config --name <value> --wallet-id <value> --description <value> --credential-offer-duration <value> --file credentialSchemas.json
```

_See code: [src/commands/issuance/create-config.ts](https://github.com/affinidi/affinidi-cli/blob/v2.10.2/src/commands/issuance/create-config.ts)_

## `affinidi issuance delete-config`

Deletes credential issuance configuration from your active project

```
USAGE
  $ affinidi issuance delete-config [--json] [--no-color] [--no-input] [-i <value>]

FLAGS
  -i, --id=<value>  ID of the credential issuance configuration

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

EXAMPLES
  $ affinidi issuance delete-config -i <value>

  $ affinidi issuance delete-config --id <value>
```

_See code: [src/commands/issuance/delete-config.ts](https://github.com/affinidi/affinidi-cli/blob/v2.10.2/src/commands/issuance/delete-config.ts)_

## `affinidi issuance get-config`

Gets the details of the credential issuance configuration in your active project

```
USAGE
  $ affinidi issuance get-config [--json] [--no-color] [--no-input] [-i <value>]

FLAGS
  -i, --id=<value>  ID of the credential issuance configuration

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

EXAMPLES
  $ affinidi issuance get-config -i <value>

  $ affinidi issuance get-config --id <value>
```

_See code: [src/commands/issuance/get-config.ts](https://github.com/affinidi/affinidi-cli/blob/v2.10.2/src/commands/issuance/get-config.ts)_

## `affinidi issuance list-configs`

Lists credential issuance configurations in your active project

```
USAGE
  $ affinidi issuance list-configs [--json] [--no-color] [--no-input]

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

EXAMPLES
  $ affinidi issuance list-configs
```

_See code: [src/commands/issuance/list-configs.ts](https://github.com/affinidi/affinidi-cli/blob/v2.10.2/src/commands/issuance/list-configs.ts)_

## `affinidi issuance update-config`

Updates credential issuance configuration in your active project

```
USAGE
  $ affinidi issuance update-config [--json] [--no-color] [--no-input] [-i <value>] [-n
    <value>] [-d <value>] [-w <value>] [--credential-offer-duration <value>] [-f <value>]

FLAGS
  -d, --description=<value>                Description of the credential issuance configuration
  -f, --file=<value>                       Location of a json file containing the list of allowed schemas for creating a
                                           credential offer. One or more schemas can be added to the issuance. The
                                           credential type ID must be unique
  -i, --id=<value>                         ID of the credential issuance configuration
  -n, --name=<value>                       Name of the credential issuance configuration
  -w, --wallet-id=<value>                  ID of the wallet
      --credential-offer-duration=<value>  Credential offer duration in seconds

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

EXAMPLES
  $ affinidi issuance update-config -i <value> -f credentialSchemas.json

  $ affinidi issuance update-config --id <value> --name <value> --wallet-id <value> --description <value> --credential-offer-duration <value> --file credentialSchemas.json
```

_See code: [src/commands/issuance/update-config.ts](https://github.com/affinidi/affinidi-cli/blob/v2.10.2/src/commands/issuance/update-config.ts)_

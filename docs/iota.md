`affinidi iota`
===============

Use these commands to manage Iota configurations

* [`affinidi iota create-config`](#affinidi-iota-create-config)
* [`affinidi iota create-pex-query`](#affinidi-iota-create-pex-query)
* [`affinidi iota delete-config`](#affinidi-iota-delete-config)
* [`affinidi iota delete-pex-query`](#affinidi-iota-delete-pex-query)
* [`affinidi iota get-config`](#affinidi-iota-get-config)
* [`affinidi iota get-pex-query`](#affinidi-iota-get-pex-query)
* [`affinidi iota list-configs`](#affinidi-iota-list-configs)
* [`affinidi iota list-pex-queries`](#affinidi-iota-list-pex-queries)
* [`affinidi iota update-config`](#affinidi-iota-update-config)
* [`affinidi iota update-pex-query`](#affinidi-iota-update-pex-query)

## `affinidi iota create-config`

Creates Iota configuration in your active project

```
USAGE
  $ affinidi iota create-config [--json] [--no-color] [--no-input] [-n <value>] [-d
    <value>] [--wallet-ari <value>] [--token-max-age <value>] [--response-webhook-url <value>] [--enable-verification]
    [--enable-consent-audit-log] [--client-name <value>] [--client-origin <value>] [--client-logo <value>]

FLAGS
  -d, --description=<value>           Description of the Iota configuration
  -n, --name=<value>                  Name of the Iota configuration
      --client-logo=<value>           Application URL of a logo, displayed in the consent page
      --client-name=<value>           Name, displayed in the consent page
      --client-origin=<value>         Domain, displayed in the consent page
      --enable-consent-audit-log      Log consents
      --enable-verification           Perform verification
      --response-webhook-url=<value>  Iota response webhook URL
      --token-max-age=<value>         [default: 10] Token expiration time in minutes - integer between 1 and 10
      --wallet-ari=<value>            ARI of the wallet

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

EXAMPLES
  $ affinidi iota create-config --name <value> --wallet-ari <value>

  $ affinidi iota create-config --name <value> --wallet-ari <value> --enable-consent-audit-log <value> --enable-verification <value> --token-max-age <value>
```

_See code: [src/commands/iota/create-config.ts](https://github.com/affinidi/affinidi-cli/blob/v2.8.1/src/commands/iota/create-config.ts)_

## `affinidi iota create-pex-query`

Creates PEX query for your Iota configuration

```
USAGE
  $ affinidi iota create-pex-query [--json] [--no-color] [--no-input] [-i <value>] [-n
    <value>] [-d <value>] [-f <value>]

FLAGS
  -d, --description=<value>       PEX query description
  -f, --file=<value>              Location of a json file containing PEX query
  -i, --configuration-id=<value>  ID of the Iota configuration
  -n, --name=<value>              PEX query name

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

EXAMPLES
  $ affinidi iota create-pex-query -i <value> -n <value> -d <value> -f pexQuery.json

  $ affinidi iota create-pex-query --configuration-id <value> --name <value> --description <value> --file pexQuery.json
```

_See code: [src/commands/iota/create-pex-query.ts](https://github.com/affinidi/affinidi-cli/blob/v2.8.1/src/commands/iota/create-pex-query.ts)_

## `affinidi iota delete-config`

Deletes Iota configuration from your active project

```
USAGE
  $ affinidi iota delete-config [--json] [--no-color] [--no-input] [-i <value>]

FLAGS
  -i, --id=<value>  ID of the Iota configuration

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

EXAMPLES
  $ affinidi iota delete-config -i <value>

  $ affinidi iota delete-config --id <value>
```

_See code: [src/commands/iota/delete-config.ts](https://github.com/affinidi/affinidi-cli/blob/v2.8.1/src/commands/iota/delete-config.ts)_

## `affinidi iota delete-pex-query`

Deletes the PEX query from your Iota configuration

```
USAGE
  $ affinidi iota delete-pex-query [--json] [--no-color] [--no-input]
    [--configuration-id <value>] [--query-id <value>]

FLAGS
  --configuration-id=<value>  ID of the Iota configuration
  --query-id=<value>          PEX query ID

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

EXAMPLES
  $ affinidi iota delete-pex-query --configuration-id <uuid> --query-id <uuid>
```

_See code: [src/commands/iota/delete-pex-query.ts](https://github.com/affinidi/affinidi-cli/blob/v2.8.1/src/commands/iota/delete-pex-query.ts)_

## `affinidi iota get-config`

Gets the details of Iota configuration in your active project

```
USAGE
  $ affinidi iota get-config [--json] [--no-color] [--no-input] [-i <value>]

FLAGS
  -i, --id=<value>  ID of the Iota configuration

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

EXAMPLES
  $ affinidi iota get-config -i <value>

  $ affinidi iota get-config --id <value>
```

_See code: [src/commands/iota/get-config.ts](https://github.com/affinidi/affinidi-cli/blob/v2.8.1/src/commands/iota/get-config.ts)_

## `affinidi iota get-pex-query`

Gets the PEX query details for your Iota configuration

```
USAGE
  $ affinidi iota get-pex-query [--json] [--no-color] [--no-input]
    [--configuration-id <value>] [--query-id <value>]

FLAGS
  --configuration-id=<value>  ID of the Iota configuration
  --query-id=<value>          PEX query ID

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

EXAMPLES
  $ affinidi iota get-pex-query --configuration-id <uuid> --query-id <uuid>
```

_See code: [src/commands/iota/get-pex-query.ts](https://github.com/affinidi/affinidi-cli/blob/v2.8.1/src/commands/iota/get-pex-query.ts)_

## `affinidi iota list-configs`

Lists Iota configurations in your active project

```
USAGE
  $ affinidi iota list-configs [--json] [--no-color] [--no-input]

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

EXAMPLES
  $ affinidi iota list-configs
```

_See code: [src/commands/iota/list-configs.ts](https://github.com/affinidi/affinidi-cli/blob/v2.8.1/src/commands/iota/list-configs.ts)_

## `affinidi iota list-pex-queries`

Lists PEX queries for your Iota configuration

```
USAGE
  $ affinidi iota list-pex-queries [--json] [--no-color] [--no-input] [-i <value>]

FLAGS
  -i, --configuration-id=<value>  ID of the Iota configuration

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

EXAMPLES
  $ affinidi iota list-pex-queries -i <value>

  $ affinidi iota list-pex-queries --configuration-id <value>
```

_See code: [src/commands/iota/list-pex-queries.ts](https://github.com/affinidi/affinidi-cli/blob/v2.8.1/src/commands/iota/list-pex-queries.ts)_

## `affinidi iota update-config`

Updates Iota configuration in your active project

```
USAGE
  $ affinidi iota update-config [--json] [--no-color] [--no-input] [-i <value>] [-n
    <value>] [-d <value>] [--wallet-ari <value>] [--token-max-age <value>] [--response-webhook-url <value>]
    [--enable-verification] [--enable-consent-audit-log] [--client-name <value>] [--client-origin <value>]
    [--client-logo <value>]

FLAGS
  -d, --description=<value>           Description of the Iota configuration
  -i, --id=<value>                    ID of the Iota configuration
  -n, --name=<value>                  Name of the Iota configuration
      --client-logo=<value>           Application URL of a logo, displayed in the consent page
      --client-name=<value>           Name, displayed in the consent page
      --client-origin=<value>         Domain, displayed in the consent page
      --enable-consent-audit-log      Log consents
      --enable-verification           Perform verification
      --response-webhook-url=<value>  Iota response webhook URL
      --token-max-age=<value>         Token expiration time in seconds - integer between 1 and 10
      --wallet-ari=<value>            ARI of the wallet

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

EXAMPLES
  $ affinidi iota update-config -i <value>

  $ affinidi iota update-config --id <value>
```

_See code: [src/commands/iota/update-config.ts](https://github.com/affinidi/affinidi-cli/blob/v2.8.1/src/commands/iota/update-config.ts)_

## `affinidi iota update-pex-query`

Updates PEX query for your Iota configuration

```
USAGE
  $ affinidi iota update-pex-query [--json] [--no-color] [--no-input]
    [--configuration-id <value>] [--query-id <value>] [-d <value>] [-f <value>]

FLAGS
  -d, --description=<value>       PEX query description
  -f, --file=<value>              Location of a json file containing PEX query
      --configuration-id=<value>  ID of the Iota configuration
      --query-id=<value>          PEX query ID

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

EXAMPLES
  $ affinidi iota update-pex-query --configuration-id <value> --query-id <value> -d <value> -f pexQuery.json

  $ affinidi iota update-pex-query --configuration-id <value> --query-id <value> --description <value> --file pexQuery.json
```

_See code: [src/commands/iota/update-pex-query.ts](https://github.com/affinidi/affinidi-cli/blob/v2.8.1/src/commands/iota/update-pex-query.ts)_

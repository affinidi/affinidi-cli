`affinidi iota`
===============

Use these commands to manage Iota configurations

* [`affinidi iota create-config`](#affinidi-iota-create-config)
* [`affinidi iota create-query`](#affinidi-iota-create-query)
* [`affinidi iota delete-config`](#affinidi-iota-delete-config)
* [`affinidi iota delete-query`](#affinidi-iota-delete-query)
* [`affinidi iota get-config`](#affinidi-iota-get-config)
* [`affinidi iota get-query`](#affinidi-iota-get-query)
* [`affinidi iota list-configs`](#affinidi-iota-list-configs)
* [`affinidi iota list-queries`](#affinidi-iota-list-queries)
* [`affinidi iota update-config`](#affinidi-iota-update-config)
* [`affinidi iota update-query`](#affinidi-iota-update-query)

## `affinidi iota create-config`

Creates Affinidi Iota Framework configuration in your active project

```
USAGE
  $ affinidi iota create-config [--json] [--no-color] [--no-input] [-n <value>] [-d
    <value>] [-w <value>] [-u <value> -m redirect|websocket] [--token-max-age <value>] [--response-webhook-url <value>]
    [--disable-verification] [--disable-consent-audit-log] [--client-name <value>] [--client-origin <value>]
    [--client-logo <value>]

FLAGS
  -d, --description=<value>           Description of the Affinidi Iota Framework configuration
  -m, --mode=<option>                 Mode of data sharing: websocket | redirect
                                      <options: redirect|websocket>
  -n, --name=<value>                  Name of the Affinidi Iota Framework configuration
  -u, --redirect-uris=<value>         Redirect URIs, separated by space (required only when mode is `redirect`)
  -w, --wallet-ari=<value>            ARI of the wallet
      --client-logo=<value>           Application URL of a logo, displayed in the consent page
      --client-name=<value>           Name, displayed in the consent page
      --client-origin=<value>         Domain, displayed in the consent page
      --disable-consent-audit-log     Disable consent audit log
      --disable-verification          Disable verification
      --response-webhook-url=<value>  Affinidi Iota Framework response webhook URL
      --token-max-age=<value>         Token expiration time in seconds

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

EXAMPLES
  $ affinidi iota create-config -n <value> -w <value>

  $ affinidi iota create-config --name <value> --wallet-ari <value>

  $ affinidi iota create-config --name <value> --wallet-ari <value> --enable-consent-audit-log --enable-verification --token-max-age <value> --mode websocket

  $ affinidi iota create-config --name <value> --wallet-ari <value> --enable-consent-audit-log --enable-verification --token-max-age <value> --mode redirect --redirectUris <value>
```

_See code: [src/commands/iota/create-config.ts](https://github.com/affinidi/affinidi-cli/blob/v2.13.0/src/commands/iota/create-config.ts)_

## `affinidi iota create-query`

Creates PEX query for your Affinidi Iota Framework configuration

```
USAGE
  $ affinidi iota create-query [--json] [--no-color] [--no-input] [-c <value>] [-n
    <value>] [-d <value>] [-f <value>]

FLAGS
  -c, --configuration-id=<value>  ID of the Affinidi Iota Framework configuration
  -d, --description=<value>       PEX query description
  -f, --file=<value>              Location of a json file containing PEX query
  -n, --name=<value>              PEX query name

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

EXAMPLES
  $ affinidi iota create-query -c <value> -n <value> -d <value> -f pexQuery.json

  $ affinidi iota create-query --configuration-id <value> --name <value> --description <value> --file pexQuery.json
```

_See code: [src/commands/iota/create-query.ts](https://github.com/affinidi/affinidi-cli/blob/v2.13.0/src/commands/iota/create-query.ts)_

## `affinidi iota delete-config`

Deletes Affinidi Iota Framework configuration from your active project

```
USAGE
  $ affinidi iota delete-config [--json] [--no-color] [--no-input] [-i <value>]

FLAGS
  -i, --id=<value>  ID of the Affinidi Iota Framework configuration

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

EXAMPLES
  $ affinidi iota delete-config -i <value>

  $ affinidi iota delete-config --id <value>
```

_See code: [src/commands/iota/delete-config.ts](https://github.com/affinidi/affinidi-cli/blob/v2.13.0/src/commands/iota/delete-config.ts)_

## `affinidi iota delete-query`

Deletes the PEX query from your Affinidi Iota Framework configuration

```
USAGE
  $ affinidi iota delete-query [--json] [--no-color] [--no-input] [-c <value>] [-i
    <value>]

FLAGS
  -c, --configuration-id=<value>  ID of the Affinidi Iota Framework configuration
  -i, --query-id=<value>          PEX query ID

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

EXAMPLES
  $ affinidi iota delete-query -c <uuid> -i <uuid>

  $ affinidi iota delete-query --configuration-id <uuid> --query-id <uuid>
```

_See code: [src/commands/iota/delete-query.ts](https://github.com/affinidi/affinidi-cli/blob/v2.13.0/src/commands/iota/delete-query.ts)_

## `affinidi iota get-config`

Gets the details of the Affinidi Iota Framework configuration in your active project

```
USAGE
  $ affinidi iota get-config [--json] [--no-color] [--no-input] [-i <value>]

FLAGS
  -i, --id=<value>  ID of the Affinidi Iota Framework configuration

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

EXAMPLES
  $ affinidi iota get-config -i <value>

  $ affinidi iota get-config --id <value>
```

_See code: [src/commands/iota/get-config.ts](https://github.com/affinidi/affinidi-cli/blob/v2.13.0/src/commands/iota/get-config.ts)_

## `affinidi iota get-query`

Gets the PEX query details for your Affinidi Iota Framework configuration

```
USAGE
  $ affinidi iota get-query [--json] [--no-color] [--no-input] [-c <value>] [-i
    <value>]

FLAGS
  -c, --configuration-id=<value>  ID of the Affinidi Iota Framework configuration
  -i, --query-id=<value>          PEX query ID

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

EXAMPLES
  $ affinidi iota get-query -c <uuid> -i <uuid>

  $ affinidi iota get-query --configuration-id <uuid> --query-id <uuid>
```

_See code: [src/commands/iota/get-query.ts](https://github.com/affinidi/affinidi-cli/blob/v2.13.0/src/commands/iota/get-query.ts)_

## `affinidi iota list-configs`

Lists Affinidi Iota Framework configurations in your active project

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

_See code: [src/commands/iota/list-configs.ts](https://github.com/affinidi/affinidi-cli/blob/v2.13.0/src/commands/iota/list-configs.ts)_

## `affinidi iota list-queries`

Lists PEX queries for your Affinidi Iota Framework configuration

```
USAGE
  $ affinidi iota list-queries [--json] [--no-color] [--no-input] [-c <value>]

FLAGS
  -c, --configuration-id=<value>  ID of the Affinidi Iota Framework configuration

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

EXAMPLES
  $ affinidi iota list-queries -c <value>

  $ affinidi iota list-queries --configuration-id <value>
```

_See code: [src/commands/iota/list-queries.ts](https://github.com/affinidi/affinidi-cli/blob/v2.13.0/src/commands/iota/list-queries.ts)_

## `affinidi iota update-config`

Updates Affinidi Iota Framework configuration in your active project

```
USAGE
  $ affinidi iota update-config [--json] [--no-color] [--no-input] [-i <value>] [-n
    <value>] [-d <value>] [--wallet-ari <value>] [-u <value> -m redirect|websocket] [--token-max-age <value>]
    [--response-webhook-url <value>] [--enable-verification] [--enable-consent-audit-log] [--client-name <value>]
    [--client-origin <value>] [--client-logo <value>]

FLAGS
  -d, --description=<value>           Description of the Affinidi Iota Framework configuration
  -i, --id=<value>                    ID of the Affinidi Iota Framework configuration
  -m, --mode=<option>                 Mode of data sharing: websocket | redirect
                                      <options: redirect|websocket>
  -n, --name=<value>                  Name of the Affinidi Iota Framework configuration
  -u, --redirect-uris=<value>         Redirect URIs, separated by space (required only when mode is `redirect`)
      --client-logo=<value>           Application URL of a logo, displayed in the consent page
      --client-name=<value>           Name, displayed in the consent page
      --client-origin=<value>         Domain, displayed in the consent page
      --enable-consent-audit-log      Log consents
      --enable-verification           Perform verification
      --response-webhook-url=<value>  Affinidi Iota Framework response webhook URL
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

_See code: [src/commands/iota/update-config.ts](https://github.com/affinidi/affinidi-cli/blob/v2.13.0/src/commands/iota/update-config.ts)_

## `affinidi iota update-query`

Updates PEX query for your Affinidi Iota Framework configuration

```
USAGE
  $ affinidi iota update-query [--json] [--no-color] [--no-input] [-c <value>] [-i
    <value>] [-d <value>] [-f <value>]

FLAGS
  -c, --configuration-id=<value>  ID of the Affinidi Iota Framework configuration
  -d, --description=<value>       PEX query description
  -f, --file=<value>              Location of a json file containing PEX query
  -i, --query-id=<value>          PEX query ID

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

EXAMPLES
  $ affinidi iota update-query -c <value> -i <value> -d <value> -f pexQuery.json

  $ affinidi iota update-query --configuration-id <value> --query-id <value> -d <value> -f pexQuery.json

  $ affinidi iota update-query --configuration-id <value> --query-id <value> --description <value> --file pexQuery.json
```

_See code: [src/commands/iota/update-query.ts](https://github.com/affinidi/affinidi-cli/blob/v2.13.0/src/commands/iota/update-query.ts)_

`affinidi wallet`
=================

Use these commands to manage your wallets

* [`affinidi wallet create-wallet`](#affinidi-wallet-create-wallet)
* [`affinidi wallet delete-wallet`](#affinidi-wallet-delete-wallet)
* [`affinidi wallet get-wallet`](#affinidi-wallet-get-wallet)
* [`affinidi wallet list-wallets`](#affinidi-wallet-list-wallets)
* [`affinidi wallet update-wallet`](#affinidi-wallet-update-wallet)

## `affinidi wallet create-wallet`

Creates wallet in your active project

```
USAGE
  $ affinidi wallet create-wallet [--json] [--no-color] [--no-input] [-n <value>] [-d
    <value>] [-u <value> -m key|web]

FLAGS
  -d, --description=<value>  Description of the wallet
  -m, --did-method=<option>  DID method
                             <options: key|web>
  -n, --name=<value>         Name of the wallet
  -u, --did-web-url=<value>  URL of the DID if DID method is did:web

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

EXAMPLES
  $ affinidi wallet create-wallet

  $ affinidi wallet create-wallet --name <value> --description <value>

  $ affinidi wallet create-wallet --name <value> --description <value> --did-method key

  $ affinidi wallet create-wallet --name <value> --description <value> --did-method web --did-web-url <value>
```

_See code: [src/commands/wallet/create-wallet.ts](https://github.com/affinidi/affinidi-cli/blob/v2.10.2/src/commands/wallet/create-wallet.ts)_

## `affinidi wallet delete-wallet`

Deletes wallet from your active project

```
USAGE
  $ affinidi wallet delete-wallet [--json] [--no-color] [--no-input] [-i <value>]

FLAGS
  -i, --id=<value>  ID of the wallet

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

EXAMPLES
  $ affinidi wallet delete-wallet -i <value>

  $ affinidi wallet delete-wallet --id <value>
```

_See code: [src/commands/wallet/delete-wallet.ts](https://github.com/affinidi/affinidi-cli/blob/v2.10.2/src/commands/wallet/delete-wallet.ts)_

## `affinidi wallet get-wallet`

Gets wallet details in your active project

```
USAGE
  $ affinidi wallet get-wallet [--json] [--no-color] [--no-input] [-i <value>]

FLAGS
  -i, --id=<value>  ID of the wallet

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

EXAMPLES
  $ affinidi wallet get-wallet -i <value>

  $ affinidi wallet get-wallet --id <value>
```

_See code: [src/commands/wallet/get-wallet.ts](https://github.com/affinidi/affinidi-cli/blob/v2.10.2/src/commands/wallet/get-wallet.ts)_

## `affinidi wallet list-wallets`

Lists wallets in your active project

```
USAGE
  $ affinidi wallet list-wallets [--json] [--no-color] [--no-input]

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

EXAMPLES
  $ affinidi wallet list-wallets
```

_See code: [src/commands/wallet/list-wallets.ts](https://github.com/affinidi/affinidi-cli/blob/v2.10.2/src/commands/wallet/list-wallets.ts)_

## `affinidi wallet update-wallet`

Updates wallet in your active project

```
USAGE
  $ affinidi wallet update-wallet [--json] [--no-color] [--no-input] [-i <value>] [-n
    <value>] [-d <value>]

FLAGS
  -d, --description=<value>  Description of the wallet
  -i, --id=<value>           ID of the wallet
  -n, --name=<value>         Name of the wallet

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

EXAMPLES
  $ affinidi wallet update-wallet -i <value>

  $ affinidi wallet update-wallet --id <value> --name <value> --description <value>
```

_See code: [src/commands/wallet/update-wallet.ts](https://github.com/affinidi/affinidi-cli/blob/v2.10.2/src/commands/wallet/update-wallet.ts)_

`affinidi token`
================

Use these commands for Personal Access Token (PAT) management

* [`affinidi token create-token`](#affinidi-token-create-token)
* [`affinidi token delete-token`](#affinidi-token-delete-token)
* [`affinidi token get-token`](#affinidi-token-get-token)
* [`affinidi token list-tokens`](#affinidi-token-list-tokens)
* [`affinidi token update-token`](#affinidi-token-update-token)

## `affinidi token create-token`

Creates a Personal Access Token (PAT)

```
USAGE
  $ affinidi token create-token [--json] [--no-color] [--no-input] [-n <value>] [-k
    <value>] [-a RS256|RS512|ES256|ES512] [-w] [-p <value> [-g | -f <value>]]

FLAGS
  -a, --algorithm=<option>       [default: RS256] The specific cryptographic algorithm used with the key
                                 <options: RS256|RS512|ES256|ES512>
  -f, --public-key-file=<value>  Location of the public key PEM file
  -g, --auto-generate-key        Auto-generate private-public key pair
  -k, --key-id=<value>           Identifier of the key (kid)
  -n, --name=<value>             Name of the Personal Access Token, at least 8 chars long
  -p, --passphrase=<value>       Passphrase for generation of private public key pair
  -w, --with-permissions         Set token policies to perform any action on the active project

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

EXAMPLES
  $ affinidi token create-token

  $ affinidi token create-token --name "My new token"

  $ affinidi token create-token -n MyNewToken --with-permissions

  $ affinidi token create-token -n MyNewToken --auto-generate-key

  $ affinidi token create-token -n MyNewToken --auto-generate-key --passphrase "MySecretPassphrase" --with-permissions

  $ affinidi token create-token -n MyNewToken --public-key-file publicKey.pem --key-id MyKeyID --algorithm RS256 --with-permissions

  $ affinidi token create-token -n MyNewToken -g -w
```

_See code: [src/commands/token/create-token.ts](https://github.com/affinidi/affinidi-cli/blob/v2.6.1/src/commands/token/create-token.ts)_

## `affinidi token delete-token`

Deletes a Personal Access Token (PAT)

```
USAGE
  $ affinidi token delete-token [--json] [--no-color] [--no-input] [-i <value>]

FLAGS
  -i, --token-id=<value>  ID of the Personal Access Token

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

EXAMPLES
  $ affinidi token delete-token -i <uuid>

  $ affinidi token delete-token --token-id <uuid>
```

_See code: [src/commands/token/delete-token.ts](https://github.com/affinidi/affinidi-cli/blob/v2.6.1/src/commands/token/delete-token.ts)_

## `affinidi token get-token`

Gets the details of a Personal Access Token (PAT)

```
USAGE
  $ affinidi token get-token [--json] [--no-color] [--no-input] [-i <value>]

FLAGS
  -i, --token-id=<value>  ID of the Personal Access Token

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

EXAMPLES
  $ affinidi token get-token -i <uuid>

  $ affinidi token get-token --token-id <uuid>
```

_See code: [src/commands/token/get-token.ts](https://github.com/affinidi/affinidi-cli/blob/v2.6.1/src/commands/token/get-token.ts)_

## `affinidi token list-tokens`

Lists your Personal Access Tokens (PATs)

```
USAGE
  $ affinidi token list-tokens [--json] [--no-color] [--no-input]

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

EXAMPLES
  $ affinidi token list-tokens
```

_See code: [src/commands/token/list-tokens.ts](https://github.com/affinidi/affinidi-cli/blob/v2.6.1/src/commands/token/list-tokens.ts)_

## `affinidi token update-token`

Updates a Personal Access Token (PAT)

```
USAGE
  $ affinidi token update-token [--json] [--no-color] [--no-input] [-i <value>] [-n
    <value>] [-k <value>] [-f <value>] [--algorithm RS256|RS512|ES256|ES512]

FLAGS
  -f, --public-key-file=<value>  Location of the public key PEM file
  -i, --token-id=<value>         ID of the Personal Access Token
  -k, --key-id=<value>           Identifier of the key (kid)
  -n, --name=<value>             Name of the Personal Access Token, at least 8 chars long
      --algorithm=<option>       [default: RS256] The specific cryptographic algorithm used with the key
                                 <options: RS256|RS512|ES256|ES512>

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

EXAMPLES
  $ affinidi token update-token -i <uuid> -n MyNewToken -k MyKeyID -f publicKey.pem

  $ affinidi token update-token --token-id <uuid> --name "My new token" --key-id "My key ID" --public-key-file publicKey.pem --algorithm RS256
```

_See code: [src/commands/token/update-token.ts](https://github.com/affinidi/affinidi-cli/blob/v2.6.1/src/commands/token/update-token.ts)_

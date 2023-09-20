# Affinidi CLI

## Introduction

The Affinidi Command Line Interface (Affinidi CLI) is a unified tool to manage your Affinidi services.
With just one tool to download and configure,
you can control multiple Affinidi services from the command line and automate them through scripts.

In the context of software development, the term "Greenfield version" refers to a brand-new,
from-scratch version of a software product or system that isn't constrained by existing versions -
meaning it is different than the GitHub version (v1).

Internal Note: CLI green field version doesn't support core services.
We have other version to support core services & API Key generation: https://github.com/affinidi/affinidi-cli

## Installation

### Prerequisites:

You need to have installed on your machine:

- [git](https://git-scm.com/)
- [NodeJs v18 and higher](https://nodejs.org). (it's recommended to use [nvm](https://github.com/nvm-sh/nvm))
- A chromium based browser (chrome, brave, etc) is your default browser.
- Install Affinidi Browser Extension to your browser (:warning: Link is internal)

### Development mode:
```
git clone https://gitlab.com/affinidi/foundational/phoenix/affinidi-cli
cd affinidi-cli
npm i
npm run build
./bin/dev [command]
```

Example:

```
./bin/dev help
```

### Production mode:

Uninstall all the previous versions of affinidi-cli
```
npm uninstall -g @affinidi/cli
```

Install and link the package to use `affinidi` command
```
git clone https://gitlab.com/affinidi/foundational/phoenix/affinidi-cli
cd affinidi-cli
npm ci
npm run build
npm link

affinidi [command]
```

Example:
```
affinidi help
```

## Commands
<!-- commands -->
* [`affinidi autocomplete [SHELL]`](#affinidi-autocomplete-shell)
* [`affinidi commands`](#affinidi-commands)
* [`affinidi generate-application`](#affinidi-generate-application)
* [`affinidi help [COMMANDS]`](#affinidi-help-commands)
* [`affinidi iam add-principal`](#affinidi-iam-add-principal)
* [`affinidi iam get-policies`](#affinidi-iam-get-policies)
* [`affinidi iam list-principals`](#affinidi-iam-list-principals)
* [`affinidi iam remove-principal`](#affinidi-iam-remove-principal)
* [`affinidi iam update-policies`](#affinidi-iam-update-policies)
* [`affinidi login add-user-to-group`](#affinidi-login-add-user-to-group)
* [`affinidi login create-config`](#affinidi-login-create-config)
* [`affinidi login create-group`](#affinidi-login-create-group)
* [`affinidi login delete-config`](#affinidi-login-delete-config)
* [`affinidi login delete-group`](#affinidi-login-delete-group)
* [`affinidi login get-config`](#affinidi-login-get-config)
* [`affinidi login get-group`](#affinidi-login-get-group)
* [`affinidi login list-configs`](#affinidi-login-list-configs)
* [`affinidi login list-groups`](#affinidi-login-list-groups)
* [`affinidi login list-users-in-group`](#affinidi-login-list-users-in-group)
* [`affinidi login remove-user-from-group`](#affinidi-login-remove-user-from-group)
* [`affinidi login update-config`](#affinidi-login-update-config)
* [`affinidi project create-project`](#affinidi-project-create-project)
* [`affinidi project get-active-project`](#affinidi-project-get-active-project)
* [`affinidi project list-projects`](#affinidi-project-list-projects)
* [`affinidi project select-project`](#affinidi-project-select-project)
* [`affinidi search`](#affinidi-search)
* [`affinidi start`](#affinidi-start)
* [`affinidi stop`](#affinidi-stop)
* [`affinidi token create-token`](#affinidi-token-create-token)
* [`affinidi token delete-token`](#affinidi-token-delete-token)
* [`affinidi token get-token`](#affinidi-token-get-token)
* [`affinidi token list-tokens`](#affinidi-token-list-tokens)
* [`affinidi token update-token`](#affinidi-token-update-token)

## `affinidi autocomplete [SHELL]`

display autocomplete installation instructions

```
USAGE
  $ affinidi autocomplete [SHELL] [-r]

ARGUMENTS
  SHELL  (zsh|bash|powershell) Shell type

FLAGS
  -r, --refresh-cache  Refresh cache (ignores displaying instructions)

DESCRIPTION
  display autocomplete installation instructions

EXAMPLES
  $ affinidi autocomplete

  $ affinidi autocomplete bash

  $ affinidi autocomplete zsh

  $ affinidi autocomplete powershell

  $ affinidi autocomplete --refresh-cache
```

_See code: [@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v2.3.6/src/commands/autocomplete/index.ts)_

## `affinidi commands`

list all the commands

```
USAGE
  $ affinidi commands [--json] [-h] [--hidden] [--tree] [--columns <value> | -x] [--sort <value>] [--filter
    <value>] [--output csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -h, --help         Show CLI help.
  -x, --extended     show extra columns
  --columns=<value>  only show provided columns (comma-separated)
  --csv              output is csv format [alias: --output=csv]
  --filter=<value>   filter property by partial string matching, ex: name=foo
  --hidden           show hidden commands
  --no-header        hide table header from output
  --no-truncate      do not truncate output to fit screen
  --output=<option>  output in a more machine friendly format
                     <options: csv|json|yaml>
  --sort=<value>     property to sort by (prepend '-' for descending)
  --tree             show tree of commands

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  list all the commands
```

_See code: [@oclif/plugin-commands](https://github.com/oclif/plugin-commands/blob/v2.2.25/src/commands/commands.ts)_

## `affinidi generate-application`

Generates a reference application with filled credentials

```
USAGE
  $ affinidi generate-application [--json] [--log-level debug|info|warn|error] [--no-color]

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  Specify level for logging.
                        <options: debug|info|warn|error>
  --no-color            Disables color in the output. If you have trouble distinguishing colors, consider using this
                        flag.

EXAMPLES
  $ affinidi generate-application
```

_See code: [dist/commands/generate-application/index.ts](https://gitlab.com/affinidi/foundational/phoenix/affinidi-cli/blob/v2.0.0-beta.67/dist/commands/generate-application/index.ts)_

## `affinidi help [COMMANDS]`

Display help for affinidi.

```
USAGE
  $ affinidi help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for affinidi.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.18/src/commands/help.ts)_

## `affinidi iam add-principal`

Adds a principal (user or token) to the active project

```
USAGE
  $ affinidi iam add-principal -i <value> [--json] [--log-level debug|info|warn|error] [--no-color] [-t
    machine_user|user]

FLAGS
  -i, --principal-id=<value>     (required) ID of the principal
  -t, --principal-type=<option>  [default: machine_user] Type of the principal
                                 <options: machine_user|user>

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  Specify level for logging.
                        <options: debug|info|warn|error>
  --no-color            Disables color in the output. If you have trouble distinguishing colors, consider using this
                        flag.

DESCRIPTION
  Adds a principal (user or token) to the active project

  To change your active project, use command affinidi project select-project

EXAMPLES
  $ affinidi iam add-principal -i <uuid>

  $ affinidi iam add-principal --id <uuid> --type machine_user

FLAG DESCRIPTIONS
  -i, --principal-id=<value>  ID of the principal

    Get a list of possible IDs with command affinidi token list-tokens
```

## `affinidi iam get-policies`

Gets the policies of a principal (user or token)

```
USAGE
  $ affinidi iam get-policies -i <value> [--json] [--log-level debug|info|warn|error] [--no-color] [-t
    machine_user|user]

FLAGS
  -i, --principal-id=<value>     (required) ID of the principal
  -t, --principal-type=<option>  [default: machine_user] Type of the principal
                                 <options: machine_user|user>

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  Specify level for logging.
                        <options: debug|info|warn|error>
  --no-color            Disables color in the output. If you have trouble distinguishing colors, consider using this
                        flag.

DESCRIPTION
  Gets the policies of a principal (user or token)

  Make sure the principal you are working with is part of the active project
  Use command affinidi project select-project to change your active project

EXAMPLES
  $ affinidi iam get-policies -i <uuid>

  $ affinidi iam get-policies --id <uuid> --type machine_user

FLAG DESCRIPTIONS
  -i, --principal-id=<value>  ID of the principal

    Get a list of possible IDs with command affinidi token list-tokens
```

## `affinidi iam list-principals`

Lists the principals (users and tokens) in the active project

```
USAGE
  $ affinidi iam list-principals [--json] [--log-level debug|info|warn|error] [--no-color]

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  Specify level for logging.
                        <options: debug|info|warn|error>
  --no-color            Disables color in the output. If you have trouble distinguishing colors, consider using this
                        flag.

DESCRIPTION
  Lists the principals (users and tokens) in the active project

  To change your active project, use command affinidi project select-project

EXAMPLES
  $ affinidi iam list-principals
```

## `affinidi iam remove-principal`

Removes a principal (user or token) from the active project

```
USAGE
  $ affinidi iam remove-principal -i <value> [--json] [--log-level debug|info|warn|error] [--no-color] [-t
    machine_user|user]

FLAGS
  -i, --principal-id=<value>     (required) ID of the principal
  -t, --principal-type=<option>  [default: machine_user] Type of the principal
                                 <options: machine_user|user>

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  Specify level for logging.
                        <options: debug|info|warn|error>
  --no-color            Disables color in the output. If you have trouble distinguishing colors, consider using this
                        flag.

DESCRIPTION
  Removes a principal (user or token) from the active project

  To change your active project, use command affinidi project select-project

EXAMPLES
  $ affinidi iam remove-principal -i <uuid>

  $ affinidi iam remove-principal --id <uuid> --type machine_user

FLAG DESCRIPTIONS
  -i, --principal-id=<value>  ID of the principal

    Get a list of possible IDs with command affinidi token list-tokens
```

## `affinidi iam update-policies`

Updates the policies of a principal (user or token) in the active project

```
USAGE
  $ affinidi iam update-policies -i <value> [--json] [--log-level debug|info|warn|error] [--no-color] [-t
    machine_user|user] [-f <value>]

FLAGS
  -f, --file=<value>             Location of a json file containing principal policies
  -i, --principal-id=<value>     (required) ID of the principal
  -t, --principal-type=<option>  [default: machine_user] Type of the principal
                                 <options: machine_user|user>

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  Specify level for logging.
                        <options: debug|info|warn|error>
  --no-color            Disables color in the output. If you have trouble distinguishing colors, consider using this
                        flag.

DESCRIPTION
  Updates the policies of a principal (user or token) in the active project

  Make sure the principal you are working with is part of the active project
  Use command affinidi project select-project to change your active project

EXAMPLES
  $ affinidi iam update-policies -i <uuid>

  $ affinidi iam update-policies --id <uuid> --type machine_user

FLAG DESCRIPTIONS
  -i, --principal-id=<value>  ID of the principal

    Get a list of possible IDs with command affinidi token list-tokens
```

## `affinidi login add-user-to-group`

Adds a user to a user group

```
USAGE
  $ affinidi login add-user-to-group --group-name <value> --user-sub <value> [--json] [--log-level debug|info|warn|error]
    [--no-color]

FLAGS
  --group-name=<value>  (required) Name of the user group
  --user-sub=<value>    (required) Subject of the user. Currently the user's DID is supported.

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  Specify level for logging.
                        <options: debug|info|warn|error>
  --no-color            Disables color in the output. If you have trouble distinguishing colors, consider using this
                        flag.

EXAMPLES
  $ affinidi login add-user-to-group --group-name my_group --user-sub did:key:12345
```

## `affinidi login create-config`

Creates a login configuration in your active project

```
USAGE
  $ affinidi login create-config [--json] [--log-level debug|info|warn|error] [--no-color] [-f <value> | -n <value> | -u
    <value> | --token-endpoint-auth-method client_secret_basic|client_secret_post|none | --claim-format array|map |
    --client-name <value> | --client-origin <value> | --client-logo <value>]

FLAGS
  -f, --file=<value>                     Location of a json file containing login configuration data
  -n, --name=<value>                     Name of the login configuration
  -u, --redirect-uris=<value>            OAuth 2.0 redirect URIs, separated by space
  --claim-format=<option>                ID token claims output format. Defaults to array
                                         <options: array|map>
  --client-logo=<value>                  URL of a logo for the client, displayed in the consent page
  --client-name=<value>                  Name of the client, displayed in the consent page
  --client-origin=<value>                Origin of the client, displayed in the consent page
  --token-endpoint-auth-method=<option>  Client authentication method for the token endpoint. Defaults to
                                         client_secret_post
                                         <options: client_secret_basic|client_secret_post|none>

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  Specify level for logging.
                        <options: debug|info|warn|error>
  --no-color            Disables color in the output. If you have trouble distinguishing colors, consider using this
                        flag.

EXAMPLES
  $ affinidi login create-config

  $ affinidi login create-config -f loginConfig.json

  $ affinidi login create-config -n MyLoginConfig -u http://localhost:8080/callback

  $ affinidi login create-config --name "My Login Config" --redirect-uris "https://my-fancy-project.eu.auth0.com/login/callback http://localhost:8080/callback" --token-endpoint-auth-method client_secret_post --claim-format array --scope "my_user_group my_other_group" --client-name "My App Name" --client-origin http://localhost:8080 --client-logo http://localhost:8080/logo

FLAG DESCRIPTIONS
  --token-endpoint-auth-method=client_secret_basic|client_secret_post|none

    Client authentication method for the token endpoint. Defaults to client_secret_post

    The options are:
    client_secret_post: (default) Send client_id and client_secret as application/x-www-form-urlencoded in the HTTP body
    client_secret_basic: Send client_id and client_secret as application/x-www-form-urlencoded encoded in the HTTP
    Authorization header
    none: For public clients (native/mobile apps) which can not have a secret
```

## `affinidi login create-group`

Create a user group in your active project

```
USAGE
  $ affinidi login create-group -n <value> [--json] [--log-level debug|info|warn|error] [--no-color]

FLAGS
  -n, --name=<value>  (required) Name of the user group, that follows url-friendly pattern ^[a-z_]+$

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  Specify level for logging.
                        <options: debug|info|warn|error>
  --no-color            Disables color in the output. If you have trouble distinguishing colors, consider using this
                        flag.

EXAMPLES
  $ affinidi login create-group -n my_new_group

  $ affinidi login create-group --name my_new_group
```

## `affinidi login delete-config`

Deletes a login configuration from your active project

```
USAGE
  $ affinidi login delete-config -i <value> [--json] [--log-level debug|info|warn|error] [--no-color]

FLAGS
  -i, --id=<value>  (required) ID of the login configuration

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  Specify level for logging.
                        <options: debug|info|warn|error>
  --no-color            Disables color in the output. If you have trouble distinguishing colors, consider using this
                        flag.

EXAMPLES
  $ affinidi login delete-config -i <value>

  $ affinidi login delete-config --id <value>
```

## `affinidi login delete-group`

Deletes a user group from your active project

```
USAGE
  $ affinidi login delete-group -n <value> [--json] [--log-level debug|info|warn|error] [--no-color]

FLAGS
  -n, --name=<value>  (required) Name of the user group

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  Specify level for logging.
                        <options: debug|info|warn|error>
  --no-color            Disables color in the output. If you have trouble distinguishing colors, consider using this
                        flag.

EXAMPLES
  $ affinidi login delete-group -n my_group

  $ affinidi login delete-group --name my_group
```

## `affinidi login get-config`

Gets the details of a login configuration in your active project

```
USAGE
  $ affinidi login get-config -i <value> [--json] [--log-level debug|info|warn|error] [--no-color]

FLAGS
  -i, --id=<value>  (required) ID of the login configuration

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  Specify level for logging.
                        <options: debug|info|warn|error>
  --no-color            Disables color in the output. If you have trouble distinguishing colors, consider using this
                        flag.

EXAMPLES
  $ affinidi login get-config -i <value>

  $ affinidi login get-config --id <value>
```

## `affinidi login get-group`

Gets the details of a user group

```
USAGE
  $ affinidi login get-group -n <value> [--json] [--log-level debug|info|warn|error] [--no-color]

FLAGS
  -n, --name=<value>  (required) Name of the user group

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  Specify level for logging.
                        <options: debug|info|warn|error>
  --no-color            Disables color in the output. If you have trouble distinguishing colors, consider using this
                        flag.

EXAMPLES
  $ affinidi login get-group -n my_group

  $ affinidi login get-group --name my_group
```

## `affinidi login list-configs`

Lists login configurations in your active project

```
USAGE
  $ affinidi login list-configs [--json] [--log-level debug|info|warn|error] [--no-color]

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  Specify level for logging.
                        <options: debug|info|warn|error>
  --no-color            Disables color in the output. If you have trouble distinguishing colors, consider using this
                        flag.

EXAMPLES
  $ affinidi login list-configs
```

## `affinidi login list-groups`

Lists user groups in your active project

```
USAGE
  $ affinidi login list-groups [--json] [--log-level debug|info|warn|error] [--no-color]

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  Specify level for logging.
                        <options: debug|info|warn|error>
  --no-color            Disables color in the output. If you have trouble distinguishing colors, consider using this
                        flag.

EXAMPLES
  $ affinidi login list-groups
```

## `affinidi login list-users-in-group`

Use this command to list users in the user group

```
USAGE
  $ affinidi login list-users-in-group --group-name <value> [--json] [--log-level debug|info|warn|error] [--no-color]

FLAGS
  --group-name=<value>  (required) Name of the user group

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  Specify level for logging.
                        <options: debug|info|warn|error>
  --no-color            Disables color in the output. If you have trouble distinguishing colors, consider using this
                        flag.

EXAMPLES
  $ affinidi login list-users-in-group --group-name my_group
```

## `affinidi login remove-user-from-group`

Removes a user from a user group

```
USAGE
  $ affinidi login remove-user-from-group --group-name <value> --user-mapping-id <value> [--json] [--log-level
    debug|info|warn|error] [--no-color]

FLAGS
  --group-name=<value>       (required) Name of the user group
  --user-mapping-id=<value>  (required) ID of the user mapping record

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  Specify level for logging.
                        <options: debug|info|warn|error>
  --no-color            Disables color in the output. If you have trouble distinguishing colors, consider using this
                        flag.

EXAMPLES
  $ affinidi login remove-user-from-group --group-name my_group --user-mapping-id <value>
```

## `affinidi login update-config`

Updates a login configuration

```
USAGE
  $ affinidi login update-config -i <value> [--json] [--log-level debug|info|warn|error] [--no-color] [-f <value> | -n
    <value> | -u <value> | --token-endpoint-auth-method client_secret_basic|client_secret_post|none | --client-name
    <value> | --client-origin <value> | --client-logo <value>]

FLAGS
  -f, --file=<value>                     Location of a json file containing login configuration data
  -i, --id=<value>                       (required) ID of the login configuration
  -n, --name=<value>                     Name of the login configuration
  -u, --redirect-uris=<value>            OAuth 2.0 redirect URIs, separated by space
  --client-logo=<value>                  URL of a logo for the client, displayed in the consent page
  --client-name=<value>                  Name of the client, displayed in the consent page
  --client-origin=<value>                Origin of the client, displayed in the consent page
  --token-endpoint-auth-method=<option>  Client authentication method for the token endpoint. Defaults to
                                         client_secret_post
                                         <options: client_secret_basic|client_secret_post|none>

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  Specify level for logging.
                        <options: debug|info|warn|error>
  --no-color            Disables color in the output. If you have trouble distinguishing colors, consider using this
                        flag.

EXAMPLES
  $ affinidi login update-config --id <value> -f loginConfig.json

  $ affinidi login update-config --id <value> -u http://localhost:8080/callback

  $ affinidi login update-config --id <value> --name "My Login Config" --redirect-uris "https://my-fancy-project.eu.auth0.com/login/callback http://localhost:8080/callback" --token-endpoint-auth-method client_secret_post --client-name "My App Name" --client-origin http://localhost:8080 --client-logo http://localhost:8080/logo

FLAG DESCRIPTIONS
  --token-endpoint-auth-method=client_secret_basic|client_secret_post|none

    Client authentication method for the token endpoint. Defaults to client_secret_post

    The options are:
    client_secret_post: (default) Send client_id and client_secret as application/x-www-form-urlencoded in the HTTP body
    client_secret_basic: Send client_id and client_secret as application/x-www-form-urlencoded encoded in the HTTP
    Authorization header
    none: For public clients (native/mobile apps) which can not have a secret
```

## `affinidi project create-project`

Creates a project

```
USAGE
  $ affinidi project create-project -n <value> [--json] [--log-level debug|info|warn|error] [--no-color]

FLAGS
  -n, --name=<value>  (required) Name of the project

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  Specify level for logging.
                        <options: debug|info|warn|error>
  --no-color            Disables color in the output. If you have trouble distinguishing colors, consider using this
                        flag.

EXAMPLES
  $ affinidi project create-project -n MyProjectName

  $ affinidi project create-project --name "My project name"
```

## `affinidi project get-active-project`

Gets the current active project

```
USAGE
  $ affinidi project get-active-project [--json] [--log-level debug|info|warn|error] [--no-color]

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  Specify level for logging.
                        <options: debug|info|warn|error>
  --no-color            Disables color in the output. If you have trouble distinguishing colors, consider using this
                        flag.

EXAMPLES
  $ affinidi project get-active-project
```

## `affinidi project list-projects`

Lists your projects

```
USAGE
  $ affinidi project list-projects [--json] [--log-level debug|info|warn|error] [--no-color]

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  Specify level for logging.
                        <options: debug|info|warn|error>
  --no-color            Disables color in the output. If you have trouble distinguishing colors, consider using this
                        flag.

EXAMPLES
  $ affinidi project list-projects
```

## `affinidi project select-project`

Sets a project as the active project

```
USAGE
  $ affinidi project select-project [--json] [--log-level debug|info|warn|error] [--no-color] [-i <value>]

FLAGS
  -i, --project-id=<value>  ID of the project

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  Specify level for logging.
                        <options: debug|info|warn|error>
  --no-color            Disables color in the output. If you have trouble distinguishing colors, consider using this
                        flag.

EXAMPLES
  $ affinidi project select-project

  $ affinidi project select-project -i <project-id>

  $ affinidi project select-project --project-id <project-id>
```

## `affinidi search`

Search for a command.

```
USAGE
  $ affinidi search

DESCRIPTION
  Search for a command.

  Once you select a command, hit enter and it will show the help for that command.
```

_See code: [@oclif/plugin-search](https://github.com/oclif/plugin-search/blob/v0.0.22/dist/commands/search.ts)_

## `affinidi start`

Log in to Affinidi

```
USAGE
  $ affinidi start [--json] [--log-level debug|info|warn|error] [--no-color] [-i <value>]

FLAGS
  -i, --project-id=<value>  ID of the project to set as active

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  Specify level for logging.
                        <options: debug|info|warn|error>
  --no-color            Disables color in the output. If you have trouble distinguishing colors, consider using this
                        flag.

EXAMPLES
  $ affinidi start

  $ affinidi start -i <project-id>

  $ affinidi start --project-id <project-id>
```

_See code: [dist/commands/start/index.ts](https://gitlab.com/affinidi/foundational/phoenix/affinidi-cli/blob/v2.0.0-beta.67/dist/commands/start/index.ts)_

## `affinidi stop`

Log out from Affinidi

```
USAGE
  $ affinidi stop [--json] [--log-level debug|info|warn|error] [--no-color]

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  Specify level for logging.
                        <options: debug|info|warn|error>
  --no-color            Disables color in the output. If you have trouble distinguishing colors, consider using this
                        flag.

EXAMPLES
  $ affinidi stop
```

_See code: [dist/commands/stop/index.ts](https://gitlab.com/affinidi/foundational/phoenix/affinidi-cli/blob/v2.0.0-beta.67/dist/commands/stop/index.ts)_

## `affinidi token create-token`

Creates a token

```
USAGE
  $ affinidi token create-token -n <value> -k <value> -f <value> [--json] [--log-level debug|info|warn|error]
    [--no-color] [--algorithm RS256|RS512|ES256|ES512]

FLAGS
  -f, --public-key-file=<value>  (required) Location of the public key PEM file
  -k, --key-id=<value>           (required) Identifier of the key (kid)
  -n, --name=<value>             (required) Name of the token, at least 8 chars long
  --algorithm=<option>           [default: RS256] The specific cryptographic algorithm used with the key
                                 <options: RS256|RS512|ES256|ES512>

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  Specify level for logging.
                        <options: debug|info|warn|error>
  --no-color            Disables color in the output. If you have trouble distinguishing colors, consider using this
                        flag.

EXAMPLES
  $ affinidi token create-token -n MyNewToken -k MyKeyID -f publicKey.pem

  $ affinidi token create-token --name "My new token" --key-id MyKeyID --public-key-file publicKey.pem --algorithm RS256
```

## `affinidi token delete-token`

Deletes a token

```
USAGE
  $ affinidi token delete-token -i <value> [--json] [--log-level debug|info|warn|error] [--no-color]

FLAGS
  -i, --token-id=<value>  (required) ID of the token

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  Specify level for logging.
                        <options: debug|info|warn|error>
  --no-color            Disables color in the output. If you have trouble distinguishing colors, consider using this
                        flag.

EXAMPLES
  $ affinidi token delete-token -i <uuid>

  $ affinidi token delete-token --token-id <uuid>
```

## `affinidi token get-token`

Gets the details of a token

```
USAGE
  $ affinidi token get-token -i <value> [--json] [--log-level debug|info|warn|error] [--no-color]

FLAGS
  -i, --token-id=<value>  (required) ID of the token

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  Specify level for logging.
                        <options: debug|info|warn|error>
  --no-color            Disables color in the output. If you have trouble distinguishing colors, consider using this
                        flag.

EXAMPLES
  $ affinidi token get-token -i <uuid>

  $ affinidi token get-token --token-id <uuid>
```

## `affinidi token list-tokens`

Lists your tokens

```
USAGE
  $ affinidi token list-tokens [--json] [--log-level debug|info|warn|error] [--no-color]

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  Specify level for logging.
                        <options: debug|info|warn|error>
  --no-color            Disables color in the output. If you have trouble distinguishing colors, consider using this
                        flag.

EXAMPLES
  $ affinidi token list-tokens
```

## `affinidi token update-token`

Updates a token

```
USAGE
  $ affinidi token update-token -i <value> -n <value> -k <value> -f <value> [--json] [--log-level debug|info|warn|error]
    [--no-color] [--algorithm RS256|RS512|ES256|ES512]

FLAGS
  -f, --public-key-file=<value>  (required) Location of the public key PEM file
  -i, --token-id=<value>         (required) ID of the token
  -k, --key-id=<value>           (required) Identifier of the key (kid)
  -n, --name=<value>             (required) Name of the token, at least 8 chars long
  --algorithm=<option>           [default: RS256] The specific cryptographic algorithm used with the key
                                 <options: RS256|RS512|ES256|ES512>

GLOBAL FLAGS
  --json                Format output as json.
  --log-level=<option>  Specify level for logging.
                        <options: debug|info|warn|error>
  --no-color            Disables color in the output. If you have trouble distinguishing colors, consider using this
                        flag.

EXAMPLES
  $ affinidi token update-token -i <uuid> -n MyNewToken -k MyKeyID -f publicKey.pem

  $ affinidi token update-token --token-id <uuid> --name "My new token" --key-id "My key ID" --public-key-file publicKey.pem --algorithm RS256
```
<!-- commandsstop -->

## FAQ

### A note from Affinidi

Affinidi Developer Tools are currently in the open beta phase and we are refining our product every day. The Affinidi Developer Tools may be incomplete and may contain errors – they may be unstable and may cause a loss of functionality and data. Use of the Affinidi Developer Tools will be at your own risk. As our engineers seek to improve our platform, we would not have the resources to provide any maintenance or tech support at this time. Please bear with us as we continue to improve the platform.

### What can I develop?

You are only limited by your imagination! Affinidi Developer Tools is a toolbox with which you can build software applications for personal or commercial use.

### Is there anything I should not develop?

We only provide the tools - how you use them is largely up to you. We have no control over what you develop with our tools - but please use our tools responsibly!

We hope that you would not develop anything that contravenes any applicable laws or regulations. Your projects should also not infringe on Affinidi’s or any third party’s intellectual property (for instance, misusing other parties’ data, code, logos, etc).

### What responsibilities do I have to my end-users?

Please ensure that you have in place your own terms and conditions, privacy policies, and other safeguards to ensure that the projects you build are secure for your end users.

If you are processing personal data, please protect the privacy and other legal rights of your end-users and store their personal or sensitive information securely.

Some of our components would also require you to incorporate our end-user notices into your terms and conditions.

### Are Affinidi Developer Tools free for use?

Affinidi Developer Tools are free during the open beta phase, so come onboard and experiment with our tools and see what you can build! We may bill for certain components in the future, but we will inform you beforehand.

### Is there any limit or cap to my usage of the Affinidi Developer Tools?

We may from time to time impose limits on your use of the Affinidi Developer Tools, such as limiting the number of API requests that you may make in a given duration. This is to ensure the smooth operation of the Affinidi Developer Tools so that you and all our other users can have a pleasant experience as we continue to scale and improve the Affinidi Developer Tools.

### Do I need to provide you with anything?

From time to time, we may request certain information from you to ensure that you are complying with the [Terms of Use](https://build.affinidi.com/dev-tools/terms-of-use.pdf).

### Can I share my developer’s account with others?

When you create a developer’s account with us, we will issue you your private login credentials. Please do not share this with anyone else, as you would be responsible for activities that happen under your account. If you have friends who are interested, ask them to sign up – let's build together!

### Telemetry

Affinidi collects usage data to improve our products and services. For information on what data we collect and how we use your data, please refer to our [Privacy Policy](https://build.affinidi.com/dev-tools/privacy-policy.pdf).

Disclaimer:
Please note that this FAQ is provided for informational purposes only and is not to be considered a legal document. For the legal terms and conditions governing your use of the Affinidi Developer Tools, please refer to our [Terms of Use](https://build.affinidi.com/dev-tools/terms-of-use.pdf).

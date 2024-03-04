`affinidi login`
================

Use these commands for user login configuration and group management

* [`affinidi login add-user-to-group`](#affinidi-login-add-user-to-group)
* [`affinidi login create-config`](#affinidi-login-create-config)
* [`affinidi login create-group`](#affinidi-login-create-group)
* [`affinidi login delete-config`](#affinidi-login-delete-config)
* [`affinidi login delete-group`](#affinidi-login-delete-group)
* [`affinidi login export-configs`](#affinidi-login-export-configs)
* [`affinidi login export-groups`](#affinidi-login-export-groups)
* [`affinidi login get-config`](#affinidi-login-get-config)
* [`affinidi login get-group`](#affinidi-login-get-group)
* [`affinidi login import-configs`](#affinidi-login-import-configs)
* [`affinidi login import-groups`](#affinidi-login-import-groups)
* [`affinidi login list-configs`](#affinidi-login-list-configs)
* [`affinidi login list-groups`](#affinidi-login-list-groups)
* [`affinidi login list-users-in-group`](#affinidi-login-list-users-in-group)
* [`affinidi login remove-user-from-group`](#affinidi-login-remove-user-from-group)
* [`affinidi login update-config`](#affinidi-login-update-config)

## `affinidi login add-user-to-group`

Adds a user to a user group

```
USAGE
  $ affinidi login add-user-to-group [--json] [--no-color] [--no-input] [--group-name <value>] [--user-id <value>]

FLAGS
  --group-name=<value>  Name of the user group
  --user-id=<value>     Id of the user. Currently the user's DID is supported.

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

EXAMPLES
  $ affinidi login add-user-to-group --group-name my_group --user-id did:key:12345
```

## `affinidi login create-config`

Creates a login configuration in your active project

```
USAGE
  $ affinidi login create-config [--json] [--no-color] [--no-input] [-f <value> | -n <value> | -u <value> |
    --token-endpoint-auth-method client_secret_basic|client_secret_post|none | --claim-format array|map | --client-name
    <value> | --client-origin <value> | --client-logo <value>]

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
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

EXAMPLES
  $ affinidi login create-config

  $ affinidi login create-config -f loginConfig.json

  $ affinidi login create-config -n MyLoginConfig -u http://localhost:8080/callback

  $ affinidi login create-config --name "My Login Config" --redirect-uris "https://my-fancy-project.eu.auth0.com/login/callback http://localhost:8080/callback" --token-endpoint-auth-method client_secret_post --claim-format array --client-name "My App Name" --client-origin http://localhost:8080 --client-logo http://localhost:8080/logo

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
  $ affinidi login create-group [--json] [--no-color] [--no-input] [-n <value>]

FLAGS
  -n, --name=<value>  Name of the user group, that follows url-friendly pattern ^[a-z_]+$

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

EXAMPLES
  $ affinidi login create-group -n my_new_group

  $ affinidi login create-group --name my_new_group
```

## `affinidi login delete-config`

Deletes a login configuration from your active project

```
USAGE
  $ affinidi login delete-config [--json] [--no-color] [--no-input] [-i <value>]

FLAGS
  -i, --id=<value>  ID of the login configuration

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

EXAMPLES
  $ affinidi login delete-config -i <value>

  $ affinidi login delete-config --id <value>
```

## `affinidi login delete-group`

Deletes a user group from your active project

```
USAGE
  $ affinidi login delete-group [--json] [--no-color] [--no-input] [-n <value>]

FLAGS
  -n, --name=<value>  Name of the user group

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

EXAMPLES
  $ affinidi login delete-group -n my_group

  $ affinidi login delete-group --name my_group
```

## `affinidi login export-configs`

Export selected login configurations of your active project

```
USAGE
  $ affinidi login export-configs [--json] [--no-color] [--no-input] [-i <value>] [-p <value>]

FLAGS
  -i, --ids=<value>   IDs of the login configurations to export, separated by space
  -p, --path=<value>  Relative or absolute path where configurations should be exported

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

EXAMPLES
  $ affinidi login export-configs

  $ affinidi login export-configs --ids "configurationId1 configurationId2" --path "../my-configs.json"
```

## `affinidi login export-groups`

Export selected user groups with its users

```
USAGE
  $ affinidi login export-groups [--json] [--no-color] [--no-input] [-n <value>] [-p <value>]

FLAGS
  -n, --names=<value>  Group names to export, separated by space
  -p, --path=<value>   Relative or absolute path where user groups should be exported

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

EXAMPLES
  $ affinidi login export-groups

  $ affinidi login export-groups --names "groupName1 groupName2" --path "../my-user-groups.json"
```

## `affinidi login get-config`

Gets the details of a login configuration in your active project

```
USAGE
  $ affinidi login get-config [--json] [--no-color] [--no-input] [-i <value>]

FLAGS
  -i, --id=<value>  ID of the login configuration

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

EXAMPLES
  $ affinidi login get-config -i <value>

  $ affinidi login get-config --id <value>
```

## `affinidi login get-group`

Gets the details of a user group

```
USAGE
  $ affinidi login get-group [--json] [--no-color] [--no-input] [-n <value>]

FLAGS
  -n, --name=<value>  Name of the user group

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

EXAMPLES
  $ affinidi login get-group -n my_group

  $ affinidi login get-group --name my_group
```

## `affinidi login import-configs`

Import login configurations in your active project

```
USAGE
  $ affinidi login import-configs [--json] [--no-color] [--no-input] [-p <value>]

FLAGS
  -p, --path=<value>  Path to file with configurations that should be imported

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

EXAMPLES
  $ affinidi login import-configs

  $ affinidi login import-configs --path "../my-configs.json"
```

## `affinidi login import-groups`

Import groups with its users

```
USAGE
  $ affinidi login import-groups [--json] [--no-color] [--no-input] [-p <value>]

FLAGS
  -p, --path=<value>  Path to file with groups that should be imported

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

EXAMPLES
  $ affinidi login import-groups

  $ affinidi login import-groups --path "../my-groups.json"
```

## `affinidi login list-configs`

Lists login configurations in your active project

```
USAGE
  $ affinidi login list-configs [--json] [--no-color] [--no-input]

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

EXAMPLES
  $ affinidi login list-configs
```

## `affinidi login list-groups`

Lists user groups in your active project

```
USAGE
  $ affinidi login list-groups [--json] [--no-color] [--no-input]

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

EXAMPLES
  $ affinidi login list-groups
```

## `affinidi login list-users-in-group`

Use this command to list users in the user group

```
USAGE
  $ affinidi login list-users-in-group [--json] [--no-color] [--no-input] [--group-name <value>]

FLAGS
  --group-name=<value>  Name of the user group

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

EXAMPLES
  $ affinidi login list-users-in-group --group-name my_group
```

## `affinidi login remove-user-from-group`

Removes a user from a user group

```
USAGE
  $ affinidi login remove-user-from-group [--json] [--no-color] [--no-input] [--group-name <value>] [--user-id <value>]

FLAGS
  --group-name=<value>  Name of the user group
  --user-id=<value>     ID of the user

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

EXAMPLES
  $ affinidi login remove-user-from-group --group-name my_group --user-id did:key:12345
```

## `affinidi login update-config`

Updates a login configuration

```
USAGE
  $ affinidi login update-config [--json] [--no-color] [--no-input] [-i <value>] [-f <value> | -n <value> | -u <value> |
    --token-endpoint-auth-method client_secret_basic|client_secret_post|none | --client-name <value> | --client-origin
    <value> | --client-logo <value>]

FLAGS
  -f, --file=<value>                     Location of a json file containing login configuration data
  -i, --id=<value>                       ID of the login configuration
  -n, --name=<value>                     Name of the login configuration
  -u, --redirect-uris=<value>            OAuth 2.0 redirect URIs, separated by space
  --client-logo=<value>                  URL of a logo for the client, displayed in the consent page
  --client-name=<value>                  Name of the client, displayed in the consent page
  --client-origin=<value>                Origin of the client, displayed in the consent page
  --token-endpoint-auth-method=<option>  Client authentication method for the token endpoint. Defaults to
                                         client_secret_post
                                         <options: client_secret_basic|client_secret_post|none>

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

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

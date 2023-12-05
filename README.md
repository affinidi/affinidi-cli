# Affinidi CLI

Affinidi CLI is a developer tool to easily manage your projects and integration with Affinidi services using command line. It empowers developers to use simple commands to improve developer experience when interacting with our different services.

## Requirements

- [NodeJs v18 or higher](https://nodejs.org)
- A Chromium-based browser such as [Chrome](https://www.google.com/chrome/), [Microsoft Edge](https://www.microsoft.com/edge/download), [Opera](https://www.opera.com/) or [Brave](https://brave.com/)
- Install Affinidi Vault [extension](https://chrome.google.com/webstore/detail/fejpjjkbaklcdcibmkbmpanjbiihclon) in your browser
- To generate reference applications you will also need [git](https://git-scm.com/)

## Installation

Install the latest version of Affinidi CLI

```bash
npm install -g @affinidi/cli
```

Uninstall the Affinidi CLI

```bash
npm uninstall -g @affinidi/cli
```

Update the Affinidi CLI

```bash
npm update -g @affinidi/cli
```

## What can I do with Affinidi CLI?

Affinidi CLI is all you need to interact and consume Affinidi services. Optionally you can also use [Affinidi Portal](https://portal.affinidi.com) or call Affinidi APIs directly.

### Set up Affinidi Login for your applications

Affinidi CLI allows you to make the necessary configurations to add [Affinidi Login](https://www.affinidi.com/product/affinidi-login) to you applications for a secure, passwordless and privacy preserving login experience.

Learn more about how Affinidi Login works in the [documentation site](https://docs.affinidi.com/docs/affinidi-login/how-affinidi-login-works/).

All of the Affinidi Login commands can be found under `affinidi login <command>`

#### Login Configuration

The first thing you will want to do is create a login configuration. Read more about login configuration parameters [here](https://docs.affinidi.com/docs/affinidi-login/login-configuration/).

To create a login configuration use: [`affinidi login create-config`](#affinidi-login-create-config)

Your login configuration will be created under your CLI's active project. Learn more about [projects](#manage-your-projects) and the CLI's [active project](#active-project) below.

#### User Groups

You may also want to create user groups for your application. They allow you to set access privileges for your users inside your application. A user's Affinidi Login ID token contains the groups the user belongs to, which can be used in your application to differentiate users and grant them access. Learn more about user groups [here](https://docs.affinidi.com/docs/affinidi-login/user-groups/).

To create a user group use: [`affinidi login create-group`](#affinidi-login-create-group)

To add users to a group use: [`affinidi login add-user-to-group`](#affinidi-login-add-user-to-group)

#### Generate an Affinidi Login example application

Integrating Affinidi Login in your application is straightforward as it uses the open standards of OAuth 2.0 and OpenID Connect with the addition of Verifiable Presentation support (OID4VP). As such you can use the tools your are already familiar.

We have prepared an reference application that uses Next.js, NextAuth.js and Auth0 to get you started.

To generate a reference application use: [`affinidi generate app`](#affinidi-generate-app)

The reference application has an MIT license, so feel free to use it as you please.

#### Journey summary

```bash
# 1. Authenticate to Affinidi
affinidi start

# 2. Create your Identity Provider application and copy it's login callback URL
#    For Auth0 this is  https://{auth0-app-domain}/login/callback

# 3. Create your login configuration
affinidi login create-config -n MyNewLoginConfig -u "https://my-fancy-project.eu.auth0.com/login/callback"

# 2. Create the Affinidi Login social connector on your Identity Provider application
#    Auth0 example: https://docs.affinidi.com/labs/affinidi-login-auth0/#configure-auth0-social-connection-with-affinidi-login

# 4. Generate a reference application with your login configuration
affinidi generate app

# 5. Run the reference application
```

### Manage your Affinidi resources and their access

For you and your team, as builders, Affinidi offers comprehensive IAM solutions:

#### Manage your projects

Affinidi projects allow you to manage and isolate Affinidi resources for your solution. You can also add or remove collaborators, manage permissions, enable billing and more. Think of them as Azure Resource Groups or GCP Projects.

When you first login into the CLI a default project is automatically created for you.

All project commands can be found under `affinidi project <command>`

Create a project with [`affinidi project create-project`](#affinidi-project-create-project)

For convenience, the CLI adds the concept of Active Project. This is the project you are currently working on. Read more about the CLI's [active project](#active-project) below.

#### Create Personal Access Tokens (PAT) to call Affinidi APIs

To programmatically call Affinidi APIs in your applications or in your automation you will require a Personal Access Token (PAT). Think of Personal Access Tokens as machine users that can perform operations on your behalf. PATs live outside of projects, meaning that they can be granted access to multiple projects.

PATs use asymmetric keys where you are responsible of creating and maintaining the key pair. 

Please read about more about how PAT authentication works and how you can create the keys [here](https://docs.affinidi.com/dev-tools/affinidi-cli/manage-token/#how-does-pat-authentication-works).

All PAT commands can be found under `affinidi token <command>`

Create a PAT with [`affinidi token create-token`](#affinidi-token-create-token)

#### Assign users and PATs to your projects and grant them permissions (IAM)

You can grant access to your project resources to other users or to your PATs. To do so you need to add them to your project and set their policies.

These IAM commands work under a project, so make sure to set the desired [active project](#active-project) before running them.

All IAM commands can be found under `affinidi iam <command>`

1. Add a user or a PAT to the project with [`affinidi iam add-principal`](#affinidi-iam-add-principal) - _Principals are either users or PATs (machine users)_

2. Set the principal's access policies with [`affinidi iam update-policies`](#affinidi-iam-update-policies) - _Read more about policies [here](https://docs.affinidi.com/dev-tools/affinidi-cli/manage-iam/#defining-a-policy)_

#### Journey summary

```bash
# 1. Authenticate to Affinidi
affinidi start

# 2. Create a new project
affinidi project create-project -n MyNewProject

# 3. Set as CLI's active project
affinidi project select-project

# 4. Create a PAT
affinidi token create-token -n MyNewToken -k MyKeyID -f publicKey.pem

# 5. Add the user or machine_user (PAT) to the project
affinidi iam add-principal --principal-id <uuid> --principal-type machine_user

# 6. Set the principal policies
affinidi iam update-policies --principal-id <uuid> --principal-type machine_user --file policies.json

# 7. Use PAT's private key to get a JWT and call Affinidi Services
```

## How do I use Affinidi CLI?

The first thing you will want to do in the CLI to access most features is to authenticate to Affinidi.

### Authenticating to Affinidi

Authenticating as a builder is also done with Affinidi Login, which requires you to have the Affinidi Vault extension.

Please install the [extension](https://chrome.google.com/webstore/detail/fejpjjkbaklcdcibmkbmpanjbiihclon), open the extension popup and follow the registration instructions. You can find a user guide to set up your Affinidi Vault [here](https://docs.affinidi.com/docs/get-started/#setup-affinidi-vault).

Once you have registered, authenticate in the CLI with:

```bash
affinidi start
```

### Understanding commands

Commands in Affinidi CLI have the following structure:

```bash
affinidi <topic> <command> [flags]
```

1. All commands starts with the keyword `affinidi`
2. Topics typically correspond to Affinidi services or domain
3. Commands corresponds to the actions to perform
4. Flags are a way to provide the parameters required by the command

### Available commands

In the [All Commands](#all-commands) section below you can find all of the CLI commands, with their help information, which includes usage, descriptions, flags and examples.

#### Useful commands:

[`affinidi start`](#affinidi-start) Log in to Affinidi

[`affinidi stop`](#affinidi-stop) Log out of Affinidi

[`affinidi whoami`](#affinidi-whoami) - Show the current signed in user identifiers

[`affinidi help`](#affinidi-help-commands) - Print the help information of a topic or command

[`affinidi search`](#affinidi-search) - Search and navigate through available commands

[`affinidi commands`](#affinidi-commands) - List all available commands

[`affinidi generate app`](#affinidi-generate-app) Clones and configures a reference application

[`affinidi autocomplete`](#affinidi-autocomplete-shell) - Print the instructions to set up command autocomplete

`affinidi --version` - Show the current version of the Affinidi CLI installed on your machine

### Help

All commands and topics have a help document with usage, descriptions, flags and examples.

View it with the help flag: `affinidi login create-config --help`

With the help root command: `affinidi help login create-config`

Or by searching and selecting a command: `affinidi search`

### Flags

All commands have some global flags at their disposal.

`--help` Prints the command's help information.

`--json` Enforce printing the output in json format. Useful for programmatic usage of CLI.

`--no-color` Disables color in the output. Useful if you have trouble distinguishing colors.

`--no-input` Disables all the interactive prompts. Useful for automation anc ci.

You can input flags in multiple ways. All of the following will work:

```bash
affinidi login create-config --file="config.json"
affinidi login create-config --file "config.json"
affinidi login create-config --file=config.json
affinidi login create-config --file config.json
affinidi login create-config -f "config.json"
affinidi login create-config -f="config.json"
affinidi login create-config -f"config.json"
affinidi login create-config -f config.json
affinidi login create-config -f=config.json
affinidi login create-config -fconfig.json
```

### Active Project

Affinidi CLI introduces a local concept of "Active Project" for convenience. Commands under the `login` and `iam` topics perform actions under a particular project. In order to not have to ask for the project and create the necessary credentials each time you call one of these commands, we ask you to define the CLI's working project once.

To check what is the current active project use the command [`affinidi project get-active-project`](#affinidi-project-get-active-project)

To switch the active project use the command [`affinidi project select-project`](#affinidi-project-select-project)

When you authenticate to Affinidi, the first project is set as your active one by default.

### Session and configuration files

When you authenticate to Affinidi with affinidi start the CLI will create a folder with a credentials file in your home directory.

`~/.affinidi/credentials-v2.json` - Stores your current session credentials. Keep it secret as this allows you to call Affinidi services.

When you run affinidi stop your session information is deleted.


## Support & Feedback

If you face any issue or have some suggestion for us please don't hesitate to create a ticket [here](https://share.hsforms.com/1i-4HKZRXSsmENzXtPdIG4g8oa2v).

If you have a technical issue with the CLI's codebase, you can also [create an issue](https://github.com/affinidi/affinidi-cli/issues) directly in GitHub.

## FAQ

### What can I develop?

You are only limited by your imagination! Affinidi CLI is a toolbox with which you can build software applications for personal or commercial use.

### Is there anything I should not develop?

We only provide the tools - how you use them is largely up to you. We have no control over what you develop with our tools - but please use our tools responsibly!

We hope that you would not develop anything that contravenes any applicable laws or regulations. Your projects should also not infringe on Affinidi’s or any third party’s intellectual property (for instance, misusing other parties’ data, code, logos, etc).

### What responsibilities do I have to my end-users?

Please ensure that you have in place your own terms and conditions, privacy policies, and other safeguards to ensure that the projects you build are secure for your end users.

If you are processing personal data, please protect the privacy and other legal rights of your end-users and store their personal or sensitive information securely.

Some of our components would also require you to incorporate our end-user notices into your terms and conditions.

### Is Affinidi CLI free for use?

Affinidi CLI itself is free, so come onboard and experiment with our tools and see what you can build! We may bill for certain components in the future, but we will inform you beforehand.

### Is there any limit or cap to my usage of the Affinidi CLI?

We may from time to time impose limits on your use of the Affinidi CLI, such as limiting the number of API requests that you may make in a given duration. This is to ensure the smooth operation of the Affinidi CLI so that you and all our other users can have a pleasant experience as we continue to scale and improve the Affinidi CLI.

### Do I need to provide you with anything?

From time to time, we may request certain information from you to ensure that you are complying with the [Terms and Conditions](https://www.affinidi.com/terms-conditions).

### Can I share my developer’s account with others?

When you create a developer’s account with us, we will issue you your private login credentials. Please do not share this with anyone else, as you would be responsible for activities that happen under your account. If you have friends who are interested, ask them to sign up – let's build together!

### Telemetry

Affinidi collects usage data to improve our products and services. For information on what data we collect and how we use your data, please refer to our [Privacy Notice](https://www.affinidi.com/privacy-notice).

_Disclaimer:
Please note that this FAQ is provided for informational purposes only and is not to be considered a legal document. For the legal terms and conditions governing your use of the Affinidi CLI, please refer to our [Terms and Conditions](https://www.affinidi.com/terms-conditions)._

## All commands

<!-- commands -->
* [`affinidi autocomplete [SHELL]`](#affinidi-autocomplete-shell)
* [`affinidi commands`](#affinidi-commands)
* [`affinidi generate app`](#affinidi-generate-app)
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
* [`affinidi whoami`](#affinidi-whoami)

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

## `affinidi generate app`

Generates a reference application that integrates Affinidi Login. Requires git

```
USAGE
  $ affinidi generate app [--json] [--no-color] [--no-input] [-f <value>] [-a <value>] [-p <value>] [--force]

FLAGS
  -a, --provider=<value>   Authentication provider for the reference app
  -f, --framework=<value>  Framework for the reference app
  -p, --path=<value>       Relative or absolute path where reference application should be cloned into
  --force                  Override destination directory if exists

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

EXAMPLES
  $ affinidi generate app

  $ affinidi generate app -p "../my-app" -f django -a affinidi

  $ affinidi generate app --path "../my-app" --framework django --provider affinidi --force
```

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
  $ affinidi iam add-principal [--json] [--no-color] [--no-input] [-i <value>] [-t token|user]

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

## `affinidi iam get-policies`

Gets the policies of a principal (user or token)

```
USAGE
  $ affinidi iam get-policies [--json] [--no-color] [--no-input] [-i <value>] [-t token|user]

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

## `affinidi iam remove-principal`

Removes a principal (user or token) from the active project

```
USAGE
  $ affinidi iam remove-principal [--json] [--no-color] [--no-input] [-i <value>] [-t token|user]

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

## `affinidi iam update-policies`

Updates the policies of a principal (user or token) in the active project

```
USAGE
  $ affinidi iam update-policies [--json] [--no-color] [--no-input] [-i <value>] [-t token|user] [-f <value>]

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

## `affinidi project create-project`

Creates a project and sets it as the active project

```
USAGE
  $ affinidi project create-project [--json] [--no-color] [--no-input] [-n <value>] [-d <value>]

FLAGS
  -d, --description=<value>  Description of the project
  -n, --name=<value>         Name of the project

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

EXAMPLES
  $ affinidi project create-project -n MyProjectName

  $ affinidi project create-project --name "My project name"
```

## `affinidi project get-active-project`

Gets the current active project

```
USAGE
  $ affinidi project get-active-project [--json] [--no-color] [--no-input]

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

EXAMPLES
  $ affinidi project get-active-project
```

## `affinidi project list-projects`

Lists your projects

```
USAGE
  $ affinidi project list-projects [--json] [--no-color] [--no-input]

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

EXAMPLES
  $ affinidi project list-projects
```

## `affinidi project select-project`

Sets a project as the active project

```
USAGE
  $ affinidi project select-project [--json] [--no-color] [--no-input] [-i <value>]

FLAGS
  -i, --project-id=<value>  ID of the project

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

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
  $ affinidi start [--json] [--no-color] [--no-input]

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

EXAMPLES
  $ affinidi start
```

_See code: [dist/commands/start.ts](https://github.com/affinidi/affinidi-cli/blob/v2.0.0/dist/commands/start.ts)_

## `affinidi stop`

Log out from Affinidi

```
USAGE
  $ affinidi stop [--json] [--no-color] [--no-input]

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

EXAMPLES
  $ affinidi stop
```

_See code: [dist/commands/stop.ts](https://github.com/affinidi/affinidi-cli/blob/v2.0.0/dist/commands/stop.ts)_

## `affinidi token create-token`

Creates a Personal Access Token (PAT)

```
USAGE
  $ affinidi token create-token [--json] [--no-color] [--no-input] [-n <value>] [-k <value>] [-f <value>] [--algorithm
    RS256|RS512|ES256|ES512]

FLAGS
  -f, --public-key-file=<value>  Location of the public key PEM file
  -k, --key-id=<value>           Identifier of the key (kid)
  -n, --name=<value>             Name of the Personal Access Token, at least 8 chars long
  --algorithm=<option>           [default: RS256] The specific cryptographic algorithm used with the key
                                 <options: RS256|RS512|ES256|ES512>

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

EXAMPLES
  $ affinidi token create-token -n MyNewToken -k MyKeyID -f publicKey.pem

  $ affinidi token create-token --name "My new token" --key-id MyKeyID --public-key-file publicKey.pem --algorithm RS256
```

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

## `affinidi token update-token`

Updates a Personal Access Token (PAT)

```
USAGE
  $ affinidi token update-token [--json] [--no-color] [--no-input] [-i <value>] [-n <value>] [-k <value>] [-f <value>]
    [--algorithm RS256|RS512|ES256|ES512]

FLAGS
  -f, --public-key-file=<value>  Location of the public key PEM file
  -i, --token-id=<value>         ID of the Personal Access Token
  -k, --key-id=<value>           Identifier of the key (kid)
  -n, --name=<value>             Name of the Personal Access Token, at least 8 chars long
  --algorithm=<option>           [default: RS256] The specific cryptographic algorithm used with the key
                                 <options: RS256|RS512|ES256|ES512>

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

EXAMPLES
  $ affinidi token update-token -i <uuid> -n MyNewToken -k MyKeyID -f publicKey.pem

  $ affinidi token update-token --token-id <uuid> --name "My new token" --key-id "My key ID" --public-key-file publicKey.pem --algorithm RS256
```

## `affinidi whoami`

Returns user's subject, projects, and token details from the current session.

```
USAGE
  $ affinidi whoami [--json] [--no-color] [--no-input]

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

EXAMPLES
  $ affinidi whoami
```

_See code: [dist/commands/whoami.ts](https://github.com/affinidi/affinidi-cli/blob/v2.0.0/dist/commands/whoami.ts)_
<!-- commandsstop -->

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

View the installed version on your machine

```bash
affinidi --version
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

In the [`Command Topics`](#command-topics) section below, you can find the topics with all their commands and help information, which includes usage, descriptions, flags and examples.


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

When you authenticate to Affinidi with `affinidi start` the CLI will store your current session in OS Keychain (on macOS the passwords are managed by the Keychain, on Linux they are managed by the Secret Service API/libsecret, and on Windows they are managed by Credential Vault).

NOTE: If system keychain is not available, the CLI will create a folder with a credentials file in your home directory.
`~/.affinidi/credentials-v2.json` - Stores your current session credentials. Keep it secret as this allows you to call Affinidi services.

When you run `affinidi stop` your session information is deleted.

<!-- commands -->
# Command Topics

* [`affinidi autocomplete`](docs/autocomplete.md) - display autocomplete installation instructions
* [`affinidi commands`](docs/commands.md) - list all the commands
* [`affinidi generate`](docs/generate.md) - Use these commands to generate code to get started or to scaffold your solution
* [`affinidi help`](docs/help.md) - Display help for affinidi.
* [`affinidi iam`](docs/iam.md) - Use these commands to manage policies for access configuration
* [`affinidi login`](docs/login.md) - Use these commands for user login configuration and group management
* [`affinidi project`](docs/project.md) - Use these commands to manage your projects
* [`affinidi search`](docs/search.md) - Search for a command.
* [`affinidi start`](docs/start.md) - Log in to Affinidi
* [`affinidi stop`](docs/stop.md) - Log out from Affinidi
* [`affinidi token`](docs/token.md) - Use these commands for Personal Access Token (PAT) management
* [`affinidi whoami`](docs/whoami.md) - Returns user's subject, projects, and token details from the current session.

<!-- commandsstop -->

# Support & Feedback

If you face any issue or have some suggestion for us please don't hesitate to create a ticket [here](https://share.hsforms.com/1i-4HKZRXSsmENzXtPdIG4g8oa2v).

If you have a technical issue with the CLI's codebase, you can also [create an issue](https://github.com/affinidi/affinidi-cli/issues) directly in GitHub.

# FAQ

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

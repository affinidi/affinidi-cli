# Affinidi CLI

[Introduction](#introduction)

[Features](#features)

[Installation](#installation)

[Quick Start](#quick-start)

[CLI Commands](#cli-commands)

[About Schemas and Verifiable Credentials](#about-schemas-and-verifiable-credentials)

[Feedback & Support](#feedback--support)

[FAQ](#faq)

#

## Introduction

Affinidi’s vision is to empower communities with control and ownership of their data,
creating new business models and greater trust.

As the customer demand for control and ownership of data continues to grow, it is
becoming increasingly important for developers to better manage data privacy and portability
within their apps. With our tooling, you can start creating a privacy-preserving app within minutes.

### What are privacy-preserving apps?

Privacy-preserving apps make it easy to give your customers more control over how their information is used and shared. We enable this data ownership and control through Decentralized Identifiers (DIDs) and Verifiable Credentials (VCs).

Learn more about [VCs](https://academy.affinidi.com/what-are-verifiable-credentials-79f1846a7b9), [trust triangle](https://academy.affinidi.com/what-is-the-trust-triangle-9a9caf36b321), [Decentralized Identifiers (DIDs)](https://academy.affinidi.com/demystifying-decentralized-identifiers-dids-2dc6fc3148fd), and [selective disclosure](https://academy.affinidi.com/a-detailed-guide-on-selective-disclosure-87b89cea1602).
&nbsp;

&nbsp;

## Features

The following features are available through Affinidi CLI:

### Affinidi account

- create and manage your Affinidi account
- create projects, to better organise and manage what you are building
- access your API keys

### Schemas

- create and manage schemas, which serve as templates to issue credentials

### Verifiable Credentials (VCs)

VCs are tamper-evident credentials that can be verified cryptographically.
With Affinidi CLI you can:

- issue VCs in bulk or individually
- verify VCs

### Reference App

Generate a ready-to-use application that provides a web interface for:

- issuing VCs
- claiming and managing VCs
- verifying VCs
  &nbsp;

&nbsp;

#

## Installation

### Prerequisites:

You need to have installed on your machine:

- [git](https://git-scm.com/)
- [NodeJs](https://nodejs.org). (it's recommended to use [nvm](https://github.com/nvm-sh/nvm))

Run the installation command:

```
npm install -g @affinidi/cli
```

&nbsp;

## Quick Start

To start using our privacy-preserving tools, please follow the next two steps:

1. authenticate by creating an account, or logging in to your account if you already have one
2. create a project, or activate a project if you already created one

### Authentication:

You will need your email address, and then the code sent to your email to confirm authentication.

To create an account:

```
affinidi sign-up
```

If you already have an account:

```
affinidi login
```

Full reference for each command can be found here:
[`sign-up`](#affinidi-sign-up)
[`login`](#affinidi-login)

### Create or activate a project:

The `create` command creates and activates a project. Follow the prompts to choose a name or add a name directly after the command.

```
affinidi create project
```

The `use` command activates an already existing project:

```
affinidi use project [<project-id>]
```

You can also simply type this and follow the prompts to choose from a list of existing projects:

```
affinidi use project
```

Full reference for each command can be found here:
[`create`](#affinidi-create)
[`use`](#affinidi-use)

### Schemas

To issue a VC you first have to create a schema or choose an existing one:

1. A schema can be created using the `create` command. You will need to provide a _schemaName_ and a _description_ in text format as well as a _source_ with the path to the json file with the schema properties.

```
 $ affinidi create schema [schemaName] --description=<value> --source=<value>
```

2. To see available schemas:

```
 $ affinidi list schemas
```

You will need the value of the property `jsonSchemaUrl` of the created or chosen schema to issue VCs.

Please see [About Schemas and Verifiable Credentials](#about-schemas-and-verifiable-credentials) for a detailed explanation on schema structures and how to create and find schemas using the [Schema Manager](https://affinidi-schema-manager.prod.affinity-project.org/api-docs/#).
Full reference for each command can be found here:
[`create`](#affinidi-create)
[`list`](#affinidi-list)

### Verifiable Credentials

You can issue and verify VCs within Affinidi CLI.

1. To issue a VC you need to provide the _email_ of the VC's owner, the `jsonSchemaUrl` of the _schema_ on which the VC is based, and a path to the json file with credential _data_.

```
$ affinidi issue-vc [EMAIL] --schema=<value> --data <value>
```

Please see [How to structure a JSON file to issue a VC](#how-to-structure-a-json-file-to-issue-a-vc) for more details.

2. To verify a VC you need to provide a path to the json file with the credential _data_ to be verified.

```
$ affinidi verify-vc --data=<value>
```

Full reference for each command can be found here:
[issue-vc](#affinidi-issue-vc)
[verify-vc](#affinidi-verify-vc)

### Generate an application

The [Affinidi Reference App](https://github.com/affinidi/elements-reference-app-frontend) provides a simple web interface for issuing, claiming and verifying VCs. It can be quickly generated by typing:

```
$ affinidi generate-application
```

You can also specify a name with:

```
$ affinidi generate-application --name=<value>
```

For the full reference, please see the [`affinidi generate-application`](#affinidi-generate-application) command below.

&nbsp;

&nbsp;

#

## CLI Commands

### **autocomplete**

Display autocomplete installation instructions.

USAGE

```
  $ affinidi autocomplete [SHELL] [FLAGS]
```

ARGUMENTS

```
  SHELL  Shell type
```

FLAGS

```
  -r, --refresh-cache  Refresh cache (ignores displaying instructions)
```

EXAMPLES

```
  $ affinidi autocomplete

  $ affinidi autocomplete bash

  $ affinidi autocomplete zsh

  $ affinidi autocomplete --refresh-cache
```

You can also see the help for the command in the CLI:

```
$ affinidi autocomplete --help
```

### **affinidi config**

Use this command to configure CLI settings or delete user saved configurations. Current config settings include:

- Output format view
- Saved Username

USAGE

```
  $ affinidi config SUBCOMMAND [ARGS]
```

SUBCOMMAND

```
  view          Configures the output view format

  username      Persists a username in config file to be used in the future when not providing a username when loggin in
```

CONFIG FLAGS

```
-u, --unset-all                 Remove username from config
-o, --output=(plaintext|json)   [default: plaintext] Formats output view
```

USERNAME FLAGS

```
-o, --output=(plaintext|json)   [default: plaintext] Formats output view
```

EXAMPLES

```
 affinidi config --unset-all

 affinidi config view json

 affinidi config username email@example.com
```

You can also see the help for the command in the CLI:

```
affinidi config --help
```

### **affinidi create**

Use this command to create a new resource. Current supported resource types are:

- Affinidi project
- schema

USAGE

```
$ affinidi create SUBCOMMAND [ARGS...] [FLAGS]
```

SUBCOMMANDS

```
project          Creates a new Affinidi project.
schema           Creates a new schema for a verifiable credential.
```

To create a project:

```
$ affinidi create project [projectName]
```

Or simply type this and follow the prompts:

```
$ affinidi create project
```

Note: When a project is created, its API keys are displayed only once. Full project details are stored locally in `~/.affinidi/credentials.json`. This file is deleted at the end of the authenticated session.

PROJECT FLAGS

```
  -o, --output=(plaintext|json)   [default: plaintext] Formats output view
```

To create a schema:

```
 $ affinidi create schema [schemaName] [FLAGS]
```

SCHEMA FLAGS

```
  -d, --description=<value>       (required) Description of schema
  -o, --output=(plaintext|json)   [default: plaintext] Formats output view
  -p, --public=(true|false)       [default: false] To specify if you want to create public or private schemas
  -s, --source=<value>            (required) Path to the json file with schema properties
```

Please see [How to structure a schema](#how-to-structure-a-schema) for guidance on how to create the _source_ file.
EXAMPLES

```
$ affinidi create project "Example Project"

$ affinidi create schema "Example Name" -d "An example description" -s "/exampleSchema.json"
```

You can also see the help for the command in the CLI:

```
$ affinidi create --help
$ affinidi create project --help
$ affinidi create schema --help
```

### **affinidi generate-application**

Use this command to generate a privacy-preserving app. Please see [Affinidi Reference App](https://github.com/affinidi/elements-reference-app-frontend) for more details.

USAGE

```
$ affinidi generate-application [-n <value>] [-w]
```

FLAGS

```
-n, --name=<value>              [default: my-app] Name of the application
-o, --output=(plaintext|json)   [default: plaintext] Override default output format view
-w, --with-proxy                Add backend-proxy to protect credentials
```

You can use this to generate the application with the default values:

```
$ affinidi generate-application
```

EXAMPLES

```
$ affinidi generate-application -n ExampleApp
```

You can also see the help for the command in the CLI:

```
$ affinidi generate-application --help
```

### **affinidi help**

Display help for affinidi

USAGE

```
affinidi help
```

### **affinidi issue-vc**

Issues a verifiable credential based on a given schema

USAGE

```
$ affinidi issue-vc [EMAIL] [FLAGS]
```

FLAGS

```
-b, --bulk            Defines that issuance happens in bulk
-d, --data=<value>    (required) The source file with credential data, either .json or .csv
-o, --output=(plaintext|json)   [default: plaintext] Formats output view
-s, --schema=<value>  (required) Json schema url
-w, --wallet=<value>  [default: https://wallet.affinidi.com/claim] Configure your own wallet to store VCs
```

EXAMPLES

```
$ affinidi issue-vc example@email.com -s "https://example.org/exampleSchema.json" -d "/exampleCredential.json"

$ affinidi issue-vc -s "https://example.org/exampleSchema.json" -d "/exampleCredential.csv" -b

```

You can also see the help for the command in the CLI:

```
$ affinidi issue-vc --help
```

### **affinidi list**

Use the list command to display resources that you have created or are available.
The current types of resources are:

- schemas
- projects

USAGE

```
$ affinidi list [SUBCOMMAND] [ARGS...] [FLAGS]
```

SUBCOMMANDS

```
projects          Shows you the list of your projects
schemas           Shows a list of available schemas
```

FLAGS for project listing

```
-l, --limit=<value>                           [default: 10] Maximum number of projects which will be listed
-o, --output=(json|table|csv)  [default: json] Project listing output format
-s, --skip=<value>                            Index into projects list from which to start the listing
```

FLAGS for schema listing

```
-c, --scope=(default|public|unlisted)  [default: default] The type of scope
-l, --limit=<value>                    [default: 10] The number of schemas to display
-o, --output=(json|table|csv)          [default: json] The type of output
-p, --public=(true|false)              [default: true] To specify if you want to get public or private schemas
-s, --skip=<value>                     The number of schemas to skip
-x, --extended                         show extra columns
--columns=<value>                      only show provided columns (comma-separated)
--csv                                  output is csv format [alias: --output=csv]
--filter=<value>                       filter property by partial string matching, ex: name=foo
--no-header                            hide table header from output
--no-truncate                          do not truncate output to fit screen
--sort=<value>                         property to sort by (prepend '-' for descending)
```

EXAMPLES

```
    $ affinidi list projects

    $ affinidi list schemas
```

You can also see the help for the command in the CLI:

```
$ affinidi list --help
$ affinidi list projects --help
$ affinidi list schemas --help
```

### **affinidi login**

Log in with your email address to use Affinidi privacy-preserving services. You will receive a confirmation code via email, which you will need to complete the authentication.

USAGE

```
$ affinidi login [EMAIL]
```

You can also simply type this and follow the prompts:

```
$ affinidi login
```

FLAGS

```
-o, --output=(plaintext|json)   [default: plaintext] Formats output view
```

You can also see the help for the command in the CLI:

```
$ affinidi login --help
```

### **affinidi logout**

Use this command to end your affinidi session

USAGE

```
$ affinidi logout
```

You can also see the help for the command in the CLI:

```
affinidi logout --help
```

FLAGS

```
-o, --output=(plaintext|json)   [default: plaintext] Formats output view
```

### **affinidi show**

This command displays the details of a resource. The current available resource types are:

- project
- schema

USAGE

```
$ affinidi show [SUBCOMMAND] [ARG...] [FLAGS]
```

SUBCOMMANDS

```
project         Shows information about a given project
schema          Shows the details of a schema
user            Shows info about logged-in user
```

PROJECT FLAGS

```
-a, --active                    Set to show the active project
-o, --output=(plaintext|json)   [default: plaintext] Formats output view
```

To show a project:

```
$ affinidi show [<project-id>]
```

if you simply type this, the CLI will prompt you to choose from a list of available projects:

```
$ affinidi show project
```

SCHEMA FLAGS

```
-o, --output=(plaintext|json)  Set this flag to override the default plain text format view
-s, --show=(info|json|jsonld)  [default: info] The details of the schema to show
```

To show a schema:

```
$ affinidi show schema [<schema-id>] [--output json]
```

USER FLAGS

```
-o, --output=(plaintext|json)  Set this flag to override the default plain text format view
```

To show info of logged in user:

```
$ affinidi show user
```

EXAMPLES

```
$ affinidi show project example-id

$ affinidi show schema example-id

$ affinidi show user
```

You can also see the help for the command in the CLI:

```
$ affinidi show --help
$ affinidi show project --help
$ affinidi show schema --help
$ affinidi show user --help
```

### **affinidi sign-up**

Create an Affinidi account with this command to use our privacy-preserving tools. You will need your email address, and then confirm the authentication with the code sent to your email. After confirming the authentication a default project will be created so you can start using Affinidi services right away.

USAGE

```
$ affinidi sign-up [EMAIL]
```

You can also simply type this and follow the prompts:

```
$ affinidi sign-up
```

You can also see the help for the command in the CLI:

```
$ affinidi sign-up --help
```

### **affinidi use**

The Use command lets you choose and activate a project. An active project is a prerequisite for executing most commands.

USAGE

```
$ affinidi use project [<project-id>] [FLAGS]
```

FLAGS

```
-o, --output=(plaintext|json)   [default: plaintext] Formats output view of the chosen project's details
```

EXAMPLES

```
    $ affinidi use project example-id
```

You can also see the help for the command in the CLI:

```
$ affinidi use --help
$ affinidi use project --help
```

### **affinidi analytics**

The Analytics command lets you opt in or out of sending anonymous usage data..

USAGE

```
$ affinidi analytics [true | false]
```

FLAGS

```
-o, --output=(plaintext|json)   [default: plaintext] Formats output view of the chosen project's details
```

EXAMPLES

```
    $ affinidi analytics true
```

You can also see the help for the command in the CLI:

```
$ affinidi analytics --help
```

### **affinidi verify-vc**

Verifies a verifiable credential

USAGE

```
$ affinidi verify-vc -d <value>
```

FLAGS

```
-d, --data=<value>  (required) Source json file with credentials to be verified
-o, --output=(plaintext|json)   [default: plaintext] Formats output view
```

EXAMPLES

```
$ affinidi verify-vc -d "/exampleVc.json"
```

You can also see the help for the command in the CLI:

```
$ affinidi verify-vc --help
```

&nbsp;

&nbsp;

#

## About Schemas and Verifiable Credentials

Schemas are representations of the properties that define a VC. They are a composite of [JSON Schema](https://json-schema.org/specification.html), [JSON-LD](https://www.w3.org/TR/json-ld11/) context and metadata (description, version and ownership). You can use Affinidi's [Schema Manager](https://affinidi-schema-manager.prod.affinity-project.org/api-docs) to find the right schema for your verifiable credential or to create a new one – either on the basis of an already existing schema,
or completely from scratch.

### What is Affinidi's Schema Manager?

The Schema Manager provides URLs for two kinds of schema representations: JSON Schema and JSON-LD context.
Any schema can be referenced in a verifiable credential or an application by these URLs. Before creating a new schema for your verifiable credentials, it is recommended to search for an existing one, which may fit your purpose. There are both a number of standard schemas and some user-generated schemas already available in the Schema Manager, and you can search for them by “Credential schema type”. That is why it is important to provide a meaningful and expressive type for your newly created schemas.

### How to structure a schema

The JSON representation of a schema must follow this structure:

```
{
  "type": "object",
  "properties": {
    "<propertyName>": {
      "title": "<Property title>",
      "type": "<Property type (see available attribites below)>",
      "description": "<Property description>"
    },
    <other properties>
  },
  "required": [
    <list of required properties>
  ]
}
```

And here is an example of that structure used to represent a simple form with two fields (`First Name` and `Last Name`):

```
{
  "type": "object",
  "properties": {
    "firstName": {
      "title": "First Name",
      "type": "string",
      "description": "First name of a customer"
    },
    "lastName": {
      "title": "Last Name",
      "type": "string",
      "description": "Last name of a customer"
    }
  },
  "required": [
    "lastName"
  ]
}
```

### What attribute types are available?

- Nested attribute – a container for attributes
- DID – a decentralized identifier
  - Example of VC value: "did:example:123"
- Text – a string value
  - Example of VC value: "my text"
- URI – a link to a web resource
  - Example of VC value: "http://ui.schema.affinidi.com/"
- Date – a date (ISO 8601)
  - Example of VC value: "2011-04-01"
- DateTime – a specific point in time (ISO 8601)
  - Example of VC value: "2011-05-08T19:30"
- Number – a numerical value
  - Example of VC value: 123.45
- Boolean – a boolean value
  - Example of VC value: true or false

Example of schema source with all the types:

```json
{
  "type": "object",
  "properties": {
    "nestedType": {
      "title": "nestedType",
      "type": "object",
      "description": "Field with nested attributes",
      "properties": {
        "nestedTextType": {
          "title": "nestedTextType",
          "type": "string",
          "description": "Nested text field "
        }
      },
      "required": []
    },
    "didType": {
      "title": "didType",
      "type": "string",
      "format": "did",
      "description": "DID attribute"
    },
    "testType": {
      "title": "testType",
      "type": "string",
      "description": "Text attribute"
    },
    "uriType": {
      "title": "uriType",
      "type": "string",
      "format": "uri",
      "description": "URI attribute"
    },
    "dateType": {
      "title": "dateType",
      "type": "string",
      "format": "date",
      "description": "Date attribute"
    },
    "dateTimeType": {
      "title": "dateTimeType",
      "type": "string",
      "format": "date-time",
      "description": "DateTime attribute"
    },
    "numberType": {
      "title": "numberType",
      "type": "number",
      "description": "Number attribute"
    },
    "booleanType": {
      "title": "booleanType",
      "type": "boolean",
      "description": "Boolean attribute"
    }
  },
  "required": []
}
```

### How to create or find a schema

1. You can directly create a schema in the CLI with the [`create`](#affinidi-create) command or using the [Schema Manager API](https://affinidi-schema-manager.prod.affinity-project.org/api-docs/#/Schema/CreateSchema).

2. You can list available schemas with the [`list`](#affinidi-list) command or search via the [Schema Manager API](https://affinidi-schema-manager.prod.affinity-project.org/api-docs/#/Schema/SearchSchemas) specifying `scope`, `type` or `authorDID`.

### What is the difference between a version and a revision?

Essentially, all the revisions of the single version should be compatible with each other,
whereas new versions could feature breaking changes, e.g. new mandatory fields. Currently, adherence to this principle is not enforced, but it is good to keep in mind when choosing between new version or revision for your forked schema.

### What does it mean to “publish as searchable schema”?

Schemas can be either public (visible and searchable for everyone ) or
private (unlisted, visible and searchable only for you).
When you “publish as searchable schema” (using flag `-p`), you make your schema public.

It is important to remember, that versions and revisions of public and private
(unlisted) schema are independent of each other,
and are maintained by the system in parallel.
However, you can always fork your private (unlisted) schema in order to make it public and vice versa.

### How to structure a JSON file to issue a VC:

The JSON file that is the source for the VC to be issued must follow the structure of the schema on which the VC is based. Use the properties of the schema's `credentialSubject` as the template for the new VC.

Example for [Event Eligibility Schema](https://schema.affinidi.com/EventElegibilityV1-0.json):

```
{
    "date": "2031-12-11T11:15:00Z",
    "place": "Awesome Location",
    "eventName": "Name of Your Event",
    "eventDescription": "Your Event Description",
    "name": "Holder Name",
    "email": "mail@example.com"
}
```

&nbsp;

&nbsp;

#

## Feedback & Support

Click [here](https://github.com/affinidi/affinidi-cli/issues) to create a ticket and we will get on it right away. If you are facing technical or other issues, you can reach out to us on [Discord](https://discord.com/invite/jx2hGBk5xE).

&nbsp;

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

---
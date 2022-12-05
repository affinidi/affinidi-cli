# Affinidi CLI

## Context

Affinidi’s vision is to empower communities with control and ownership of their data,
creating new business models and greater trust.

As the customer demand for control and ownership of data continues to increase, it is
becoming increasingly important for developers to better manage data privacy and portability
within their apps. With our tooling, you can start creating a privacy-preserving app within minutes.

## What are privacy-preserving apps?

Privacy-preserving apps make it easy to manage and store customer information while giving your customers more control over how this information is used and shared. We enable this data ownership and control through Decentralized Identifiers (DIDs) and Verifiable Credentials (VCs).

Learn more about [VCs](https://academy.affinidi.com/what-are-verifiable-credentials-79f1846a7b9), [trust triangle](https://academy.affinidi.com/what-is-the-trust-triangle-9a9caf36b321), [Decentralized Identifiers (DIDs)](https://academy.affinidi.com/demystifying-decentralized-identifiers-dids-2dc6fc3148fd), and [selective disclosure](https://academy.affinidi.com/a-detailed-guide-on-selective-disclosure-87b89cea1602).

## Installation

### Prerequisites:

You need to have installed on your machine:
- [git](https://git-scm.com/)
- [NodeJs](https://nodejs.org). (it's recommended to use [nvm](https://github.com/nvm-sh/nvm))


Run the installation command:
```
npm install -g @affinidi/cli
```

## Quick start

### Sign up:

```
affinidi sign-up
```
use `affinidi login` instead if you already have an Affinidi Account

### Create a project:

```
affinidi create project
```

### Generate an application

```
affinidi generate-application -n "My application"
```

### Issue a VC for an example schema

- create a file vc.json:
```
{
    "date": "2022-12-11T23:12:00Z",
    "place": "Awesome Location",
    "eventName": "Awesome Event",
    "eventDescription": "Awesome Description",
    "name": "John Snow",
    "email": "mail@example.com"
}
```

- run a command:
```
affinidi issue-vc <REPLACE WITH YOUR EMAIL> -s=https://schema.affinidi.com/TestSchemaV1-4.json -d=vc.json -w=https://holder-reference-app.stg.affinidi.com/holder
```

- find an email with credential subject and follow the link to view and claim a credential.

## Schema manager

### What is Schema manager?

If you want to build an app using Affinidi components, you should start here.
Schema Manager helps you to find the right schema for your verifiable credential
or to create a new one - either on the basis of an already existing schema,
or completely from scratch.

### How to use Schema manager?

Schema Manager provides URLs for two kinds of schema representations:
JSON Schema and JSON-LD context.
Any schema can be referenced in a verifiable credentials or an application by these URLs.

Before creating a new schema for your verifiable credentials,
it is recommended to search for an existing one, which may fit your purpose.
There are both a number of standard schemas and some user-generated schemas
already available in the Schema Manager for your disposal,
and you can search for them by “Credential schema type”.
That is why it is important to provide a meaningful and expressive type
for your newly created schemas.

### What is the difference between a version and a revision?

Essentially, all the revisions of the single version should be compatible with each other,
whereas new versions could feature breaking changes, e.g. new mandatory fields.

Currently, adherence to this principle is not enforced,
but it is good to keep in mind when choosing between new version or revision for your forked schema.

### What does it mean to “publish as searchable schema”?

Schemas can be either public (visible and searchable for everyone ) or
private (unlisted, visible and searchable only for you).
When you “publish as searchable schema” (using flag `-p`), you make your schema public.

It is important to remember, that versions and revisions of public and private
(unlisted) schema are independent of each other,
and are maintained by the system in parallel.
However, you can always fork your private (unlisted) schema in order to make it public and vice versa.

### How to create a schema

#### 1 Prepare a json file with schema details:

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
Example:
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

#### 2 Run a command:

```
affinidi create schema -d <Description of your schema> -p=<true if private, false id public) -s=<schema.json>
```

#### 3 In the response you will receive "jsonSchemaUrl" which you should use to issue a verifiable credential.

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

## Issuing a VC

### 1 Create a json file with credential subject matching the corresponding schema.
(refer to properties->credential subject of the schema to figure out the json structure)

Example for https://schema.affinidi.com/EventElegibilityV1-0.json:

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

### 2 Run the command:

```
affinidi issue-vc <holder-email@example.com> -s=<Schema Url> -d=credential.json -w=<path to holder wallet>
```

where
 - holder-email - email, where a holder will receive a link to VC offer
 - Schema Url - schema url, example: https://schema.affinidi.com/EventElegibilityV1-0.json
 - `<path to holder wallet>` - path to web UI of holder wallet, example: https://holder-reference-app.stg.affinidi.com/holder/

## CLI Commands

## affinidi generate-application

Use this command to generate a Privacy Preserving app

USAGE
```
$ affinidi generate-application [-p web|mobile] [-n <value>] [-u portable-reputation|access-without-ownership-of-data|certification-and-verification|kyc-kyb] [-w]

FLAGS
-n, --name=<value>                                                                                            [default: my-app] Name of the application
-p, --platform=(web|mobile)                                                                                   [default: web] Platform
-u, --use-case=(portable-reputation|access-without-ownership-of-data|certification-and-verification|kyc-kyb)  [default: certification-and-verification] Use case
-w, --with-proxy                                                                                              Add backend-proxy to protect credentials

DESCRIPTION
Use this command to generate a Privacy Preserving app

EXAMPLES
$ affinidi generate-application
```

## affinidi help
Display help for affinidi.

## affinidi login

Log-in with your email address to use Affinidi privacy preserving services.

USAGE
```
$ affinidi login [EMAIL]
```

EXAMPLES
```
$ affinidi login
```

## affinidi sign-up

Use this command to log-in with your email address to use Affinidi privacy preserving services.

USAGE
```
$ affinidi sign-up [EMAIL]

```
EXAMPLES
```
$ affinidi sign-up
```

## affinidi logout

Use this command to end your affinidi session

USAGE
```
$ affinidi logout
```

EXAMPLES
```
$ affinidi logout
```

## affinidi list

The list command to display various resources

USAGE
```
$ affinidi list
```


Use the list command if you want to display some of your resources
like the schemas or projects that you've created.

The current available resources are:
- schemas
- projects
  See the command examples in the help:

```
$ affinidi list --help
```

EXAMPLES
```
Shows you the list of your projects

    $ affinidi list projects

Shows a list of available schemas

    $ affinidi list schemas
```

COMMANDS
```
list projects  Perform the action of listing all the projects you created
list schemas
```

## affinidi show

The Show command to display the details of a resource

USAGE
```
$ affinidi show
```

Use the show command if you want to display some of your resources
like the schema or project that you've created.

The current available resources are:
- schema
- project
  See the command examples in the help:
```
$ affinidi show --help
```

EXAMPLES
```
Shows the details of a schema

    $ affinidi show schema [<schema-id>] [--output json]

Shows information about a specific project that you own.

    $ affinidi show [<project-id>] [--output json]
```
COMMANDS
```
show project
show schema
```

## affinidi use

The Use command selects an entity to work with

USAGE
```
$ affinidi use
```


Use the use command if you want to select a project you want to work on.

See the command examples in the help:
```
$ affinidi use --help
```

EXAMPLES
```
Use a given project

    $ affinidi use [<project-id>]
```

## affinidi issue-vc

Issues a verifiable credential based on an given schema

USAGE
```
$ affinidi issue-vc [EMAIL] -s <value> -d <value>
```

FLAGS
```
-d, --data=<value>    (required) source json file with credential data
-s, --schema=<value>  (required) json schema url
```

EXAMPLES
```
$ affinidi issue-vc
```

## affinidi verify-vc

Verifies a verifiable credential

USAGE
```
$ affinidi verify-vc -d <value>
```
FLAGS
```
-d, --data=<value>  (required) source json file with credentials to be verified
```
EXAMPLES
```
$ affinidi verify-vc
```

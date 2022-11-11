# Command Line tools for Affinidi Elements

## Installation

```
npm install @affinidi/cli
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
affinidi generate-application -n "My Application"
```

## Usage

## affinidi generate-application

Use this command to generate a Privacy Preserving app

USAGE
```
$ affinidi generate-application [-p web|mobile] [-n <value>] [-u portable-reputation|access-without-ownership-of-data|certification-and-verification|kyc-kyb]

FLAGS
-n, --name=<value>                                                                                            [default: my-app] Name of the application
-p, --platform=(web|mobile)                                                                                   [default: web] Platform
-u, --use-case=(portable-reputation|access-without-ownership-of-data|certification-and-verification|kyc-kyb)  [default: certification-and-verification] Use case

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

The Show command to display the detail of a resource

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
show project  describe the command here
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

    $ affinidi use use [<project-id>]
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

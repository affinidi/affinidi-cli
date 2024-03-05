`affinidi project`
==================

Use these commands to manage your projects

* [`affinidi project create-project`](#affinidi-project-create-project)
* [`affinidi project get-active-project`](#affinidi-project-get-active-project)
* [`affinidi project list-projects`](#affinidi-project-list-projects)
* [`affinidi project select-project`](#affinidi-project-select-project)
* [`affinidi project update-project`](#affinidi-project-update-project)

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

## `affinidi project update-project`

Updates project details

```
USAGE
  $ affinidi project update-project [--json] [--no-color] [--no-input] [-i <value>] [-n <value>] [-d <value>]

FLAGS
  -d, --description=<value>  Description of the project
  -i, --id=<value>           Project Id
  -n, --name=<value>         Name of the project

GLOBAL FLAGS
  --json      Format output as json.
  --no-color  Disables color in the output. If you have trouble distinguishing colors, consider using this flag.
  --no-input  Disables all the interactive prompts

EXAMPLES
  $ affinidi project update-project -n MyUpdatedProjectName -d MyUpdatedProjectDescription

  $ affinidi project update-project --name="My project name" --description="My project description
```

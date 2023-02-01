### The wizard, or start command

Once running the command you should first see one of the prompts below:

- if you don't have an active `project`.

```shell
Welcome to the Affinidi Wizard
You are authenticated as: <your-email@address.com>
Active project: no active projects
Please enter a project name:
```

- if you already have an active `project`.

```shell
> Welcome to the Affinidi Wizard
You are authenticated as: <your-email@address.com>
Active project: <project-id> <project-name>

? select your next step (Use arrow keys)
❯ manage projects
  manage schemas
  generate an application
  issue a vc
  verify a vc
  logout
  exit
```

Where:

- `manage projects` allows you to use any command related to `projects`:

  - creating a new one
  - seeing the active one
  - activating another one
  - listing them all
  - seeing the details of one in particular

  Output when selecting this option:

  ```shell
  ? select your next step (Use arrow keys)
  ❯ change active project
    create another project
    show active project
    show project's details
    go back to main menu
    logout
    exit
  ```

- Similarly `manage schemas` allows you to use any command related to `schemas`

  Output when selecting this option:

  ```shell
  ? select your next step (Use arrow keys)
  ❯ show schemas
    show schema details
    create schema
    go back to main menu
    logout
    exit
  ```

- `generate-application` is about generating a privacy preserving application ([see command details](../README.md#affinidi-generate-application))

  Output when selecting this option:

  ```shell
  ? select your next step generate an application

    Welcome to the Affinidi Wizard
    You are authenticated as: <your-email@address.com>
    Active project: <project-id>
    generate an application

    name of application:
  ```

- `issue-vc` is all about issuing a [verifiable credential](../README.md#about-schemas-and-verifiable-credentials). See [how it works](../README.md#affinidi-issue-vc)

  Output when selecting this option:

  ```shell
    ? select your next step (Use arrow keys)
    ❯ choose schema from list
      type schema URL
  ```

- `verify-vc` is all about verifying an issues [VC](../README.md#about-schemas-and-verifiable-credentials). See [how it works](../README.md#affinidi-verify-vc)

  Output when selecting this option:

  ```shell
  ? select your next step verify a vc
    Path to JSON file:
  ```

- `logout` simply logs you out

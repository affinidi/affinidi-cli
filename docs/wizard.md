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

- `manage projects` brings you to use any command related to `projects`:
  - creating a new one
  - seeing the active one
  - activating another one
  - listing them all
  - seeing the details of one in particular
- Similarly `manage schemas` brings you to use any command related to `schemas`
- `generate-application` is about generating a privacy preserving application ([see command details](../README.md#affinidi-generate-application))

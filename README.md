# Affinidi Cli Js

This is a repository that contains all the necessary configuration you need to successfully start development of a new service according to the standards defined by our group.

## Run the application

Add line to `~/.npmrc` where TOKEN is your Github personal access token: to include affinityProject relative common libs
`//npm.pkg.github.com/:_authToken=TOKEN`
[Howto create your Github personal access token](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line).

```shell script
$ npm install
$ npm run dev [command-name]

Examples: 
  npm run dev help
  npm run dev login
  npm run dev list schema
```

## How to use this

1. Clone the project to a new folder
2. Edit `package.json` to indicate the correct *package name, description and author*, and make sure you are using the correct or most current stable versions of the Affinity packages
3. Remove `.git` folder if you need a clean history, otherwise it's going to contain an initial commit reference
4. Initialize a new git repository if you deleted the `.git` folder
5. Delete `example` folder, it's there just so you can see the simplest setup
6. Update the file `./config/app.yaml` to config your service:
    - Protect custom routes with API Key Check Middleware `apikeyMiddlewareEnabled: true`
    - Add `publicPaths` to array to overpass API Key check
7. Update the file `./config/errors.yaml` to have custom errors for your service

## Frameworks and tools

1. Typescript
2. `oclif` the Open CLI Framework
3. `chalk` to add cli style
4. `swagger-typescript-api` to generate code from remote openapi specification files
5. `ESLint` for code analysis
6. `husky` for git hooks
7. `mocha` for testing

const { exec } = require('child_process')
const {CliUx} = require('@oclif/core')

exec('echo $SHELL', async (err, stdout, stderr)  => {
  if (err) {
    // node couldn't execute the command
    return
  }
    const answers = await CliUx.ux.prompt(`Please confirm that you want to activate autocompletion [Y/n].(it will add several lines to your ./${stdout.split('/').at(-1)}rc file`, {
      default: 'n',
    })
  if (answers.toLowerCase() === 'y'){
  if(stdout.includes('zsh')){
    execEnvVarCommand('zsh')
    return
  }
  if(stdout.includes('bash')){
    execEnvVarCommand('bash')
    return
  }
  console.log('Auto-completion supports only zsh or bash shells.') }
  console.log('Auto-completion not activated. To activate in future run npm install')
})

const execEnvVarCommand = (shell) => {
  exec(`printf "eval $(affinidi autocomplete:script ${shell})" >> ~/.${shell}rc; source ~/.${shell}rc`,(err, stdout, stderr) =>{
  if (err){
    return
  }
  if (stderr){
    console.log("Failed to activate auto-completion")
  }
  return
} )}

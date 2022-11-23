const { exec } = require('child_process')

exec('echo $SHELL', (err, stdout, stderr) => {
  if (err) {
    // node couldn't execute the command
    return
  }

  if(stdout.includes('zsh')){
    execEnvVarCommand('zsh')
    return
  }
  if(stdout.includes('bash')){
    execEnvVarCommand('bash')
    return
  }
  console.log('Auto-completion supports only zsh or bash shells.')
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

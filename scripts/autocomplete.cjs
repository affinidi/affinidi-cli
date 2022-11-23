const { exec } = require('child_process')

exec('echo $SHELL', (err, stdout, stderr) => {
  if (err) {
    // node couldn't execute the command
    return
  }
  
  if(stdout.includes('zsh')){
    exec('printf "eval $(affinidi autocomplete:script zsh)" >> ~/.zshrc; source ~/.zshrc',(err, stdout, stderr) =>{

      if (err){
        return
      }
      if (stderr){
        console.log("Failed to activate auto-completion")
      }
      return
    } )
    return
  }
  if(stdout.includes('bash')){
    exec('printf "eval $(affinidi autocomplete:script bash)" >> ~/.bash; source ~/.bash',(err, stdout, stderr) =>{
      if (err){
        return
      }
      if (stderr){
        console.log("Failed to activate auto-completion")
      }
      return
    } )
    return
  }
  console.log('Auto-completion supports only zsh or bash shells.')
})

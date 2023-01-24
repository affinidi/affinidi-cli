const {exec} = require('child_process')
const fs = require('fs');
const { env } = require('process')
const isGlobal = env.npm_config_global === "true";

const filePath = './file.txt'

const runCommand = async () => {
    try {
      const { stdout, stderr } = await new Promise((resolve, reject) => {
        exec('affinidi --version', (error, stdout, stderr) => {
          if (error) {
            reject(error);
          } else {
            resolve({ stdout, stderr });
          }
        });
    });
    console.log(stdout);
      if(stdout.includes('@affinidi/cli')){
        return 'update'
    } else {
        return 'installation'
    }
    } catch (error) {
      console.log(`affinidi cli not installed`);
    }
  }
  
  const setGlobalEnv = () => {
    if (isGlobal) {
      runCommand().then((checked) => {
        data = checked
        fs.writeFile(filePath, data, (err) => {
            if (err) {
              console.log('cannot write to file');
              return;
            }
            console.log("Data written to file successfully");
          });
      });
    }
  }

setGlobalEnv()





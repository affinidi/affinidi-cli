const isGlobal = process.env.npm_config_global === "true";
const axios  = require('axios')

var data = JSON.stringify({
    "name": "CLI_INSTALLED",
    "category": "APPLICATION",
    "component": "Cli",
    "uuid": "cli-installed-userId",
    "metadata": {}
  });
  
  var config = {
    method: 'post',
    url: 'https://analytics-stream.prod.affinity-project.org/api/events',
    headers: { 
      'Accept-Encoding': 'application/json', 
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5OWIwN2ZjOS0yZjlhLTRjNDUtOThhZi0xYjcwMzM1Nzg2Y2EiLCJ1c2VyTmFtZSI6ImRlbmlzLmRAYWZmaW5pZGkuY29tIiwiaWF0IjoxNjY5MTE0MjYwLCJleHAiOjE2ODQ2NjYyNjB9.zaRR6e4_Np6kJGqLKsatz2iovtoeZTxcgQgvYdycm9g', 
      'Content-Type': 'application/json'
    },
    data : data
  };

if(isGlobal){
axios(config)
.then(function (response) {
  console.log(response.status);
})
.catch(function (error) {
  console.log(error);
});
}

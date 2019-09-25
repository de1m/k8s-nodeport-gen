const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const https = require('https')
const fs = require('fs')
var path = require('path');
const portsFile = './nodePorts.json'

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())
app.use(express.static(__dirname + '/public'))

var k8sInfo = {
  url: process.env.K8SURL,
  port: process.env.K8SPORT,
  timeout: process.env.K8STIMEOUT || '30',
  respath: process.env.RESSPATH || '/api/v1/services',
  token: process.env.K8STOKEN,
  nodePortStart: process.env.K8SPORTSTART || '30000',
  nodePortEnd: process.env.K8SPORTEND || '32000'
}

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});


app.get('/ports', (req, res) => {
  getPorts(function (err, result) {
    if (err) {
      console.log(err);
    } else {
      res.send(result)
    }
  });
})

app.post('/reserve', function (req, res) {
  let reservePort = req.body.port;
  let nodePortsFromFile = JSON.parse(fs.readFileSync(portsFile));
  nodePortsFromFile.push(reservePort);
  fs.writeFileSync(portsFile, JSON.stringify(nodePortsFromFile));
  res.end(JSON.stringify({
    'err': false,
    'port': reservePort
  }));
})

app.listen(process.env.PORT || 8081)

function getPorts(callback) {

  var resData = '';
  var portDataArr = [];
  var nodePortsArr = [];

  var options = { //options for https request
    hostname: k8sInfo.url,
    timeout: parseInt(k8sInfo.timeout,10),
    port: parseInt(k8sInfo.port,10),
    path: k8sInfo.respath,
    rejectUnauthorized: false,
    method: 'GET',
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": 'Bearer ' + k8sInfo.token
    }
  }

  var req = https.request(options, function (res) {
    res.on('data', function (chunk) {
      resData += chunk;
    })

    res.on('end', function () {
      if (res.statusCode == '200') {
        var APIres = JSON.parse(resData);
        APIres.items.forEach(service => {
          if (service.spec.ports != undefined || service.spec.ports != null) {
            service.spec.ports.forEach(port => {
              if (port.nodePort !== undefined) {
                nodePortsArr.push(port.nodePort)
                portDataArr.push({
                  'svcname': service.metadata.name,
                  'svcportname': port.name,
                  'nodePort': port.nodePort,
                  'svcportint': port.port,
                  'svctype': port.protocol
                })
              }
            })
          }
        });
        // let numRan = getRandomInt(30001,32000);
        let fileEx = fs.existsSync(portsFile)
        if (!fileEx) {
          fs.writeFileSync(portsFile, JSON.stringify(nodePortsArr));
        } else {
          let nodePortsFromFile = []
          nodePortsFromFile = JSON.parse(fs.readFileSync(portsFile));
          nodePortsArr.forEach(port => {
            nodePortsFromFile.push(port);
          })
          let noDupArr = []
          noDupArr = Array.from(new Set(nodePortsFromFile))
          fs.writeFileSync(portsFile, JSON.stringify(noDupArr));

          let Num = getNodePort(noDupArr, function (err, nR) {
            return callback(null, {
              'srvInfo': portDataArr,
              'newPort': nR
            });
          });
        }
      } else {
        // return callback(JSON.parse(resData), null);
      }
    })

  })

  req.on('error', (e) => {
    console.error("Cannot get all pods from k8s cluster api", "Err: " + e);
    return callback(e, null);
  });

  req.set
  req.end();
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function getNodePort(portsArr, callback) {

  var createNum = function () {
    let rN = getRandomInt(parseInt(k8sInfo.nodePortStart, 10), parseInt(k8sInfo.nodePortEnd, 10));
    var found = portsArr.indexOf(rN);
    if (found === -1) {
      return callback(null, rN);
    } else {
      createNum();
    }
  }
  createNum();
}

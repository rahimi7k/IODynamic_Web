const compression = require('compression');
const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');

const app = express();

const thirdTour = process.argv[2] == 3;
const forcePort = process.argv[3];
const useHttp = process.argv[4] === 'http';

const public = "public";
const port = forcePort ? forcePort : (thirdTour ? 4201 : 4200);

app.use(compression());
app.use(express.static(public));

app.get('/', (req, res) => {
  res.sendFile(__dirname + `/${public}/index.html`);
});

//const server = useHttp ? http : https;
const server = http;

let options = {};
/*if(!useHttp) {
  options.key = fs.readFileSync(__dirname + '/certs/server-key.pem');
  options.cert = fs.readFileSync(__dirname + '/certs/server-cert.pem');
}*/

server.createServer(options, app).listen(port, () => {
  console.log('Listening port:', port);
});
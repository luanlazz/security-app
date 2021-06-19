const path = require('path');
require('dotenv').config({path: path.resolve(__dirname + '/../.env')});
const express = require('express');
const cors = require('cors');
const server = express();

const routes = require('./routes');

server.use(cors());
server.use(express.json());
server.use('/api', routes);

server.listen(process.env.API_PORT, () => {
  console.log(`Server running at localhost:${process.env.API_PORT}`);
});

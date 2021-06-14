require('dotenv').config()
const express = require('express')
const cors = require('cors')

const routes = require('./routes')

const server = express();

server.use(cors());
server.use(express.json())
server.use('/api', routes);

server.listen(process.env.API_PORT, () => {
  console.log(`Server running at localhost:${process.env.API_PORT}`)
})
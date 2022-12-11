import serverless from 'serverless-http';
import express from 'express';
import {router as CreatedEventsRouter} from './routes/createdEvent'

const LOCAL = false

const app = express()

app.use(express.json())

app.use('/created-events', CreatedEventsRouter)

app.get('/', function (req, res) {
  res.json('Hello World...')
})
 
const server = serverless(app);

if (LOCAL) {
  app.listen(3000, () => console.log("Started on http://localhost:3000"));
}

export {server}
import serverless from 'serverless-http';
import express from 'express';
import {router as CreatedEventsRouter} from './routes/createdEvent';
import {router as TicketMintedRouter} from './routes/ticketMinted';
import {router as GeneralRouter} from './routes/general';
import { load_environment_variable } from '../helpers/load_env';
import cors from 'cors';
const LOCAL = false;

const app = express()

app.use(express.json())

app.use(cors())

app.use('/created-events', CreatedEventsRouter)
app.use('/tickets-minted', TicketMintedRouter)

app.use('/', GeneralRouter);

app.get('/', function (req, res) {
  res.json('Hello World...')
})
 
const server = serverless(app);

if (LOCAL) {
  load_environment_variable("develop")
  app.listen(3000, () => console.log("Started on http://localhost:3000"));
}

export {server}
import express, { Request, Response } from 'express';
import { add_created_event, get_all_created_events } from '../../db/created_event';
import { get_network_by_name } from '../../db/networks';
import { getClient } from '../../db/_connection';
import { EventCreated } from '../../db/_models';

const router = express.Router()

router.get('/all', async (req: Request, res: Response) => {
    const createdEvents = await get_all_created_events()

    await getClient().close()
    
    res.json(createdEvents)
})

router.post('/', async (req: Request, res: Response) => {
    const createdEvent:EventCreated = req.body
    console.log(createdEvent)
    const network = req.query.network
    const network_in_db = await get_network_by_name(network)

    createdEvent.network_id = network_in_db._id!

    const newEventToDb = await add_created_event(createdEvent)

    await getClient().close()
    
    res.json(newEventToDb)
})

export {router}
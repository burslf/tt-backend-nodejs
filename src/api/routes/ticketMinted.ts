import express, { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { get_created_event, update_created_event } from '../../db/created_event';
import { add_minted_ticket } from '../../db/minted_ticket';
import { get_network_by_name } from '../../db/networks';
import { getClient } from '../../db/_connection';
import { TicketMinted } from '../../db/_models';

const router = express.Router()

router.post('/', async (req: Request, res: Response) => {
    const minted_ticket: TicketMinted = req.body

    const network = req.query.network
    const network_in_db = await get_network_by_name(network)

    minted_ticket.network_id = network_in_db._id!;
    
    const created_event = await get_created_event(minted_ticket.event_id)

    await update_created_event(minted_ticket.event_id, {'tickets_left': created_event.tickets_left - minted_ticket.amount})
    await add_minted_ticket(minted_ticket)

    await getClient().close()
    
    res.json("ok")
})

export {router}
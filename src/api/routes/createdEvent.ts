import express, { Request, Response } from 'express';
import { get_all_created_events } from '../../db/created_event';
import { getClient } from '../../db/_connection';

const router = express.Router()

router.get('/all', async (req: Request, res: Response) => {
    const createdEvents = await get_all_created_events()

    await getClient().close()
    
    res.json(createdEvents)
})

export {router}
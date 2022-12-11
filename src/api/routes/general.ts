import express, { Request, Response } from 'express';
import { get_sqs_message, send_sqs_message } from '../../helpers/sqs';

const router = express.Router()

router.get('/trigger-monitor', async (req: Request, res: Response) => {
    const auth = req.headers.authorization
    // const token = 
    const message = get_sqs_message('activity_monitor', "Waking monitor")

    await send_sqs_message('activity_monitor', JSON.stringify(message))

    res.json("ok")
})

export {router}
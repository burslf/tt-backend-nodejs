import express, { Request, Response } from 'express';
import { generate_sqs_message, send_sqs_message } from '../../helpers/aws/sqs';

const router = express.Router()

router.post('/trigger-monitor', async (req: Request, res: Response) => {
    const auth = req.headers.authorization
    const secret = auth?.split(' ')[1];
    if (process.env['SALT_SECRET'] == secret) {
        console.log(req.body)
        
        const {network_name} = req.body
        const {event_to_monitor} = req.body
        
        const message_body = {'network_name': network_name, 'event_name': event_to_monitor};
        
        const message = generate_sqs_message(`${network_name.toLowerCase()}_event_monitor`, message_body)

        await send_sqs_message('activity_monitor', message)

        return res.json("ok")
    }
    return res.status(400).json("Not found")
})

export {router}
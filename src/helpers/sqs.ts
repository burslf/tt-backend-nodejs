import { CreateQueueCommand, GetQueueUrlCommand, SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";

const get_sqs_message = (queue_name: string, message_body: {}) => {
    const message = {"Id": `u-${queue_name}`, "MessageBody": message_body}

    return message
}

const get_ses_queue_name = async (queue_name: string) => {
    const sqs = new SQSClient({})

    const env = process.env['ENV']
    
    console.log(`GET SQS QUEUE NAME ${env}_${queue_name}`)

    const command = new GetQueueUrlCommand({
        QueueName: `${env}_${queue_name}`
    })

    return await sqs.send(command)
}

const send_sqs_message = async (queue_name: string, message: {}) => {
    console.log("SEND_SQS_MESSAGE CALLED: " )
    try{
        const sqs = new SQSClient({})

        const get_queue_url = await get_ses_queue_name(queue_name)

        const queue_url = get_queue_url.QueueUrl
    
        const sendMessageCommand = new SendMessageCommand({
            MessageBody: JSON.stringify(message),
            QueueUrl: queue_url
        })
    
        await sqs.send(sendMessageCommand)
    }catch(e) {
        console.log(e)
        throw e
    }
}

export {
    get_sqs_message,
    send_sqs_message
}
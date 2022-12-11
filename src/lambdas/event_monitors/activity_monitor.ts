import { get_all_networks } from "../../db/networks";
import { getClient } from "../../db/_connection";
import { get_sqs_message, send_sqs_message } from "../../helpers/sqs";

async function activity_monitor(event: {}, context: {}) {
    try {
        const networks = await get_all_networks()
        
        await getClient().close();
        
        const events_to_monitor = [
            "EventCreated", 
            "OffchainDataUpdated", 
            "OptionAdded", 
            "OptionRemoved", 
            "TransferSingle" 
        ]
    
        const sqs_event_monitor_name = "event_monitor";
    
        for (let network of networks) {
            for (let event_to_monitor of events_to_monitor) {
                try {
                    const message_body = {'network_name': network.name, 'event_name': event_to_monitor};
                    console.log( `CALLING ${network.name.toLowerCase()}_${sqs_event_monitor_name} for network: ${network.name}`)

                    const message = get_sqs_message(
                        `${network.name.toLowerCase()}_${sqs_event_monitor_name}`, 
                        message_body
                    )

                    console.log(`MESSAGE: ${JSON.stringify(message)}`)
                    await send_sqs_message(`${network.name.toLowerCase()}_${sqs_event_monitor_name}`, message)
                }catch(e) {
                    console.log(e)
                    const error_message = JSON.stringify(e)
                    throw error_message
                    // TODO SEND SLACK MESSAGE
                }
            }
        }
    }catch(e) {
        throw e
    }
}

export {
    activity_monitor
}


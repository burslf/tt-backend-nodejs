import { get_all_networks } from "../../db/networks";
import { getClient } from "../../db/_connection";
import { get_sqs_message, send_sqs_message } from "../../helpers/sqs";

async function activity_monitor(event: {}, context: {}) {
    try {
        
        console.log("EVENT: ", event)
        const records = event["Records"];
        const body = JSON.parse(records[0]["body"]);
        const message = body["MessageBody"];
        console.log("MESSAGE: ", message)
        
        const event_name = message["event_name"];
        const network_name = message["network_name"];

        let events_to_monitor;
        let networks;

        if (event_name && network_name) {
            events_to_monitor = [event_name];
            networks = [{name: network_name}];
        }else {
            networks = await get_all_networks()
            events_to_monitor = [
                "EventCreated", 
                "OffchainDataUpdated", 
                // "OptionAdded", 
                // "OptionRemoved", 
                "TransferSingle" 
            ]
            await getClient().close();
        }

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


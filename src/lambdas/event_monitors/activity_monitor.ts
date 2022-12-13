import { get_all_networks, get_network_by_name } from "../../db/networks";
import { getClient } from "../../db/_connection";
import { Network } from "../../db/_models";
import { generate_sqs_message, get_message_from_event, send_sqs_message } from "../../helpers/aws/sqs";


async function activity_monitor(event: {}, context: {}) {
    try {
        console.log("EVENT: ", event)
        const {events_to_monitor, networks} = await get_events_and_networks_to_monitor(event)
    
        for (let network of networks) {
            for (let event_to_monitor of events_to_monitor) {
                let sqs_event_monitor_name = `${network.name.toLowerCase()}_event_monitor`;

                try {
                    const message_body = {'network_name': network.name, 'event_name': event_to_monitor};
                    const message = generate_sqs_message(sqs_event_monitor_name, message_body)
                    
                    console.log( `Calling ${sqs_event_monitor_name} for network: ${network.name}`)
                    console.log(`MESSAGE: ${JSON.stringify(message)}`)

                    await send_sqs_message(sqs_event_monitor_name, message)
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


async function get_events_and_networks_to_monitor(event: {}) {
    const message = get_message_from_event(event)
    if (!message) {
        throw `No message in event`
    };

    const event_name = message["event_name"];
    const network_name = message["network_name"];

    let events_to_monitor: string[];
    let networks: Network[];

    if (event_name && network_name) {
        events_to_monitor = [event_name];
        let network = await get_network_by_name(network_name);
        networks = [network]
    }else {
        networks = await get_all_networks()
        events_to_monitor = ["EventCreated", "OffchainDataUpdated"] // "OptionAdded", // "OptionRemoved", "TransferSingle"
        await getClient().close();
    }
    return { events_to_monitor, networks }
}

export {
    activity_monitor
}


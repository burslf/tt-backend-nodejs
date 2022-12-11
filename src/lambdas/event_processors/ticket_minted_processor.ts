import { get_unprocessed_events_by_network, set_event_completed } from "../../db/indexed_chain_event";
import { get_all_networks } from "../../db/networks";
import { get_created_event, update_created_event } from '../../db/created_event';
import { getClient } from "../../db/_connection";
import { add_minted_ticket } from "../../db/minted_ticket";

async function ticket_minted_processor(event: {}, context: {})  {
    const networks = await get_all_networks()
    for (let network of networks) {
        const unprocessed_events = await get_unprocessed_events_by_network(network._id, "TransferSingle")
        
        if (unprocessed_events.length == 0) {
            console.log("NO EVENT TO PROCESS...")
            return
        }

        console.log("UNPROCESSED EVENTS: ", unprocessed_events)
        for (let unprocessed_event of unprocessed_events) {
            const unprocessed_event_id = unprocessed_event.dictionary_attributes['id']
            const created_event = await get_created_event(Number(unprocessed_event_id));

            const tickets_left = created_event.tickets_left - Number(unprocessed_event.dictionary_attributes['value']);

            await update_created_event(created_event.event_id! , {'tickets_left': tickets_left} );

            await add_minted_ticket({
                created_at: Math.floor(Date.now() / 1000),
                updated_at: null,
                amount: Number(unprocessed_event.dictionary_attributes['value']),
                buyer: unprocessed_event.dictionary_attributes['operator'],
                receiver: unprocessed_event.dictionary_attributes['to'],
                event_id: Number(unprocessed_event.dictionary_attributes['id']),
                network_id: network._id!,
                indexed_chain_event_id: unprocessed_event._id!,
                tx_hash: unprocessed_event.tx_hash
            })

            await set_event_completed(unprocessed_event._id!);
            console.log("Unprocessed event was completed: tickets_left - ", tickets_left)

        }
    }
    
    await getClient().close();

}

export {ticket_minted_processor}

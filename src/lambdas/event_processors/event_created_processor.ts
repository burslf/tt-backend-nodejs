import { get_unprocessed_events_by_network, set_event_completed } from "../../db/indexed_chain_event";
import { get_all_networks } from "../../db/networks";
import { add_created_event } from '../../db/created_event';
import { EventCreated } from "../../db/_models";
import { get_offchain_uri, get_payees } from "../../contracts/billeterie_functions";
import { get_contract_infos } from '../../helpers/web3/web3_contract';
import { ethers } from "ethers";
import { BilleterieInstance } from "@burslf/tt-contracts";
import { getClient } from "../../db/_connection";

async function event_created_processor(event: {}, context: {})  {
    const networks = await get_all_networks()
    for (let network of networks) {
        const provider = new ethers.providers.JsonRpcProvider(network.rpc_url);
        const unprocessed_events = await get_unprocessed_events_by_network(network._id, "EventCreated")

        if (unprocessed_events.length == 0) {
            console.log("NO EVENT TO PROCESS...")
            return
        }

        for (let unprocessed_event of unprocessed_events) {
            const contract_infos = get_contract_infos(provider, network)
            const Billeterie = new BilleterieInstance(contract_infos)
            
            const unprocessed_event_id = Number(unprocessed_event.dictionary_attributes['id'])
            const unprocessed_event_creator = unprocessed_event.dictionary_attributes['owner']

            let created_event_shares;

            try {
                created_event_shares = await Billeterie.getPayees(unprocessed_event_id);
            }catch(e){
                console.log("COULDN'T FIND PAYEES")
                created_event_shares = null
            }

            console.log("CREATED EVENT SHARES: ", created_event_shares)
            const offchain_uri = await Billeterie.offchainURI(unprocessed_event_id)

            const new_event_to_db: EventCreated = {
                created_at: Math.floor(Date.now() / 1000),
                updated_at: null,
                creator: unprocessed_event_creator,
                event_id: unprocessed_event_id,
                indexed_chain_event_id: unprocessed_event._id!,
                tx_hash: unprocessed_event.tx_hash,
                network_id: network._id!,
                event_date: Number(unprocessed_event.dictionary_attributes['eventDate']),
                tickets_total: Number(unprocessed_event.dictionary_attributes['initialSupply']),
                tickets_left: Number(unprocessed_event.dictionary_attributes['initialSupply']),
                options_fees: Number(unprocessed_event.dictionary_attributes['optionFees']),
                grey_market_allowed: unprocessed_event.dictionary_attributes['greyMarketAllowed'],
                offchain_data: offchain_uri,
                shares: created_event_shares,
                price: unprocessed_event.dictionary_attributes['price'],
            }

            console.log("New event: ", new_event_to_db)
            await add_created_event(new_event_to_db);
            await set_event_completed(unprocessed_event._id!);

        }
    }
    
    await getClient().close()
}

export {event_created_processor}
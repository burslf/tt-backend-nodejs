import { get_unprocessed_events_by_network, set_event_completed } from "../../db/indexed_chain_event";
import { get_all_networks } from "../../db/networks";
import { update_created_event } from '../../db/created_event';
import { ethers } from "ethers";
import { get_contract_infos } from "../../helpers/web3/web3_contract";
import { BilleterieInstance } from "@burslf/tt-contracts";
import { getClient } from "../../db/_connection";

async function offchain_data_processor(event: {}, context: {})  {
    const networks = await get_all_networks()
    for (let network of networks) {
        const provider = new ethers.providers.JsonRpcProvider(network.rpc_url);
        const unprocessed_events = await get_unprocessed_events_by_network(network._id, "OffchainDataUpdated")
        
        if (unprocessed_events.length == 0) {
            console.log("NO EVENT TO PROCESS...")
            return
        }

        for (let unprocessed_event of unprocessed_events) {
            const contract_infos = get_contract_infos(provider, network);
            const Billeterie = new BilleterieInstance(contract_infos);
            
            const unprocessed_event_id = Number(unprocessed_event.dictionary_attributes['eventId']);
            
            console.log("Getting offchain uri: ")
            const offchain_uri = await Billeterie.offchainURI(unprocessed_event_id);

            console.log("Offchain uri: ", offchain_uri)
            console.log("Updating in DB...")
            await update_created_event(unprocessed_event_id ,{'offchain_data': offchain_uri} );

            console.log("Setting event as completed in DB...")
            await set_event_completed(unprocessed_event._id!);
            
            console.log("Unprocessed event was completed: ", offchain_uri)
        }
    }

    await getClient().close();

}

export {offchain_data_processor}

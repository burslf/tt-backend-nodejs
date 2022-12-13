import { config } from 'dotenv'
config()

import { ethers } from "ethers";

import { BilleterieInstance } from "@burslf/tt-contracts";
import { get_block_epochs } from './web3_blocks';
import { get_contract_infos } from './web3_contract';
import { Network } from '../../db/_models';

const get_past_events = async (provider: ethers.providers.Provider, network: Network, event_name: string, from_block: number) => {
    const contractInfos = get_contract_infos(provider, network)
    const Billeterie = new BilleterieInstance(contractInfos)
    const args_for_event = Billeterie.getEventArgs(event_name)
    
    let result: any[] = []
    console.log("FETCHING BLOCK EPOCH")
    const block_epochs = await get_block_epochs(provider, from_block, network.name)
    console.log("BLOCK EPOCHS: " + block_epochs.length + "\n")
    for (let block_epoch of block_epochs) {
        console.log("FETCHING PAST EVENTS...")
        const past_events = await Billeterie.contract.queryFilter(event_name, block_epoch.from_block, block_epoch.to_block)
        console.log("PAST EVENTS")
        for (let event of past_events) {
            let args = formatArgs(event, args_for_event)
    
            result.push({
                "event_name": event.event,
                "args": args,
                "block_number": event.blockNumber,
                "tx_hash": event.transactionHash
            })
        }
    }

    return result
}

const formatArgs = (event: ethers.Event, args_for_event: string[]) => {
    const args = {}

    args_for_event.forEach((arg_name: string) => {
        let is_big_number = ethers.BigNumber.isBigNumber(event.args![arg_name])
        args[arg_name] = is_big_number ? event.args![arg_name].toString() : event.args![arg_name]
    })

    return args
}

export {
    get_past_events
}

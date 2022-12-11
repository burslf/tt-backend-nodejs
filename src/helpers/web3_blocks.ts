import { ethers } from "ethers"
import { block_interval_per_chain } from "../config/chain_config";

interface BlockEpoch {
    from_block: number,
    to_block: number
}

export const get_block_epochs = async (provider: ethers.providers.Provider, from_block: number, network_name: string) => {
    const latest_block = await provider.getBlockNumber();
    let counter = from_block;

    const epochs: BlockEpoch[] = []
    const interval = block_interval_per_chain.develop[network_name]
    console.log("LATEST BLOCK: " + latest_block)
    console.log("FROM BLOCK: " + from_block)
    console.log("BLOCK INTERVAL: " + interval)
        
    while ((counter + interval) < latest_block) {
        epochs.push({
            "from_block": counter,
            "to_block": counter + interval
        })
        counter += interval
    }

    epochs.push({
        "from_block": counter,
        "to_block": latest_block
    })

    return epochs
}

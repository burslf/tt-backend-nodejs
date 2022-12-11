import { ethers } from "ethers"
import { billeterieABI } from "../config/billeterieABI"
import { contract_addresses } from "../config/chain_config"
import { Network } from "../db/_models"

const get_payees = async (event_creator, event_id: number, network: Network): Promise<[string[], number[]]> => {
    const provider = new ethers.providers.JsonRpcProvider(network.rpc_url)
    const contract_instance = new ethers.Contract(contract_addresses.billeterie.develop[network.name], billeterieABI, provider)
    const function_args = [event_creator, event_id]

    const payees = await contract_instance.functions['getPayees'](...function_args)

    const result: [string[], number[]] = [payees[0], []]
    payees[1].forEach(p => result[1].push(p.toString()))
    
    return result
}

const get_offchain_uri = async (event_id: number, network: Network) => {
    const provider = new ethers.providers.JsonRpcProvider(network.rpc_url)
    const contract_instance = new ethers.Contract(contract_addresses.billeterie.develop[network.name], billeterieABI, provider)
    
    const function_args = [event_id]

    const offchain_uri = contract_instance.functions['uri'](...function_args)

    return offchain_uri[0]
}

export {
    get_payees,
    get_offchain_uri
}
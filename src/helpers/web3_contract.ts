import { ContractInfo } from "@burslf/tt-contracts/dist/types"
import { ethers } from "ethers"
import { billeterieABI } from "../config/billeterieABI"
import { contract_addresses } from "../config/chain_config"
import { Network } from "../db/_models"

export const get_contract_infos = (provider: ethers.providers.Provider, network: Network) : ContractInfo => {
    return {
        abi: billeterieABI,
        address: contract_addresses.billeterie.develop[network.name],
        signer: provider
    }
}
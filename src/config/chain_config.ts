const contract_addresses = {
    "billeterie": {
        "develop": {
            "ETHEREUM": "0xccF20554Fea6859d5C6AfE058573598B17846796",
        }
    },
    "op_registry": {
        "develop": {
            "ETHEREUM": "0x5dbafBd6b4348384d7aaCB3c5D3325a3E774eAAC",
        }
    }
}

const contract_creation_block = {
    "develop": {
        "ETHEREUM": 8116050
    }
}

const block_interval_per_chain = {
    "develop" : {
        "AVALANCHE": 2040,
        "POLYGON": 3400,
        "ETHEREUM": 1000000
    }
}

const operator_addresses = ["0x102BB817B5Acd75d3066B20883a2F917C5677777"]

export {
    contract_addresses,
    operator_addresses,
    block_interval_per_chain,
    contract_creation_block,
}
import { ObjectId } from "mongodb"

interface Network {
    _id?: ObjectId
    created_at: number
    updated_at: number|null
    block_scanner_url: string
    rpc_url: string
    name: string
}

interface IndexedChainEvent {
    _id?: ObjectId
    created_at: number
    updated_at: number|null
    event_name: string
    contract_address: string
    dictionary_attributes: {}
    block_number: number
    tx_hash: string
    network_id: number
    completed: boolean
}

interface EventCreated {
    _id?: ObjectId
    created_at: number
    updated_at: number|null
    tx_hash: string
    event_id: number
    creator: string
    tickets_total: number
    tickets_left: number
    options_fees: number
    offchain_data: string
    shares: [string[], number[]]
    grey_market_allowed: boolean
    indexed_chain_event_id: ObjectId
    price: string
    event_date: number
    network_id: ObjectId
}

interface TicketMinted {
    _id?: ObjectId
    created_at: number
    updated_at: number|null
    tx_hash: string
    event_id: number
    buyer: string
    receiver: string
    amount: number
    indexed_chain_event_id: ObjectId
    network_id: ObjectId
}

export type {
    Network,
    IndexedChainEvent,
    TicketMinted,
    EventCreated
}
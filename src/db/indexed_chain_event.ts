import { ObjectId } from "mongodb"
import { getClient } from "./_connection"
import { IndexedChainEvent, Network } from "./_models"

const add_indexed_chain_event = async (indexedChainEvent: IndexedChainEvent) => {
    const client = getClient()
    
    const db = client.db('billeterie')
    const collection = db.collection('indexed_chain_event')

    await collection.insertOne(indexedChainEvent)

    return indexedChainEvent
}

const get_latest_event_scanned_by_event_and_network = async (event_name: string, network_name: string) : Promise<IndexedChainEvent|null> => {
    const client = getClient()
    
    const db = client.db('billeterie')
    const collection = db.collection('indexed_chain_event')

    const latestEventScanned = await collection.find({event_name: event_name}, { sort: { block_number: -1 }, limit: 1 }).toArray()

    if (latestEventScanned.length == 0) {
        return null
    }

    return (latestEventScanned as any)[0]
}

const get_unprocessed_events_by_network = async (network_id, event_name) => {
    const client = getClient()
    
    const db = client.db('billeterie')
    const collection = db.collection('indexed_chain_event')

    const latestEventScanned = await collection.find({network_id: new ObjectId(network_id), event_name: event_name, completed: false}).toArray()

    return (latestEventScanned as IndexedChainEvent[])
}

const set_event_completed = async (indexed_chain_event_id: ObjectId) => {
    const client = getClient()
    
    const db = client.db('billeterie')
    const collection = db.collection('indexed_chain_event')

    const updatedEvent = await collection.updateOne({_id: new ObjectId(indexed_chain_event_id)}, {$set: {"completed": true}})

    return updatedEvent;
}

export {
    add_indexed_chain_event,
    get_latest_event_scanned_by_event_and_network,
    get_unprocessed_events_by_network,
    set_event_completed
}
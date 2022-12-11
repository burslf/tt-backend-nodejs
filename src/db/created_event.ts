import { ObjectId } from "mongodb"
import { getClient } from "./_connection"
import { EventCreated } from "./_models"

const add_created_event = async (eventCreated: EventCreated) : Promise<EventCreated> => {
    const client = getClient()
    
    const db = client.db('billeterie')
    const collection = db.collection('event_created')

    await collection.insertOne(eventCreated)

    return eventCreated
}

const get_all_created_events = async () : Promise<EventCreated[]> => {
    const client = getClient()
    
    const db = client.db('billeterie')
    const collection = db.collection('event_created')

    const createdEvents:any = await collection.find({}).toArray()

    return createdEvents
}

const get_created_event = async (event_id: number) : Promise<EventCreated> => {
    const client = getClient()
    
    const db = client.db('billeterie')
    const collection = db.collection('event_created')

    const createdEvent:any = await collection.findOne({'event_id': event_id})

    return createdEvent
}

const update_created_event = async (event_id: number, payload) => {
    const client = getClient()
    
    const db = client.db('billeterie')
    const collection = db.collection('event_created')

    const updatedEvent = await collection.updateOne({'event_id': event_id}, {$set: payload});

    return updatedEvent
}



export {
    add_created_event,
    get_all_created_events,
    get_created_event,
    update_created_event
}
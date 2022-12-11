import { ObjectId } from "mongodb"
import { getClient } from "./_connection"
import { TicketMinted } from "./_models"

const add_minted_ticket = async (ticketMinted: TicketMinted) : Promise<TicketMinted> => {
    const client = getClient()
    
    const db = client.db('billeterie')
    const collection = db.collection('ticket_minted')

    await collection.insertOne(ticketMinted)

    return ticketMinted
}

const get_all_minted_tickets = async () : Promise<TicketMinted[]> => {
    const client = getClient()
    
    const db = client.db('billeterie')
    const collection = db.collection('ticket_minted')

    const createdEvents:any = await collection.find({}).toArray()

    return createdEvents
}

const get_all_minted_tickets_for_event = async (event_id: number) : Promise<TicketMinted[]> => {
    const client = getClient()
    
    const db = client.db('billeterie')
    const collection = db.collection('ticket_minted')

    const createdEvents:any = await collection.find({'event_id': event_id}).toArray()

    return createdEvents
}



const get_minted_ticket = async (_id: ObjectId) : Promise<TicketMinted> => {
    const client = getClient()
    
    const db = client.db('billeterie')
    const collection = db.collection('ticket_minted')

    const createdEvent:any = await collection.findOne({'_id': new ObjectId(_id)})

    return createdEvent
}

export {
    add_minted_ticket,
    get_all_minted_tickets,
    get_all_minted_tickets_for_event,
    get_minted_ticket,
}
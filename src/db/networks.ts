import { getClient } from "./_connection"
import { Network } from "./_models"

const add_network = async (network: Network) : Promise<Network> => {
    const client = getClient()

    const db = client.db('billeterie')
    const collection = db.collection('network')
    await collection.insertOne(network)

    return network
}

const get_all_networks = async () : Promise<Network[]> => {
    const client = getClient()

    const db = client.db('billeterie')
    const collection = db.collection('network')

    const networks:any = await collection.find({}).toArray()

    return networks
}

const get_network_by_name = async (network_name) : Promise<Network> => {
    const client = getClient()
    
    const db = client.db('billeterie')
    const collection = db.collection('network')

    const network:any = await collection.findOne({name: network_name})

    return network
}

export {
    add_network,
    get_all_networks,
    get_network_by_name
}
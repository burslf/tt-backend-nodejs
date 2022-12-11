import { load_environment_variable } from "./helpers/load_env";
load_environment_variable('develop')

import { ObjectId, OrderedBulkOperation } from "mongodb";
import { add_created_event, get_all_created_events } from "./db/created_event";
import { add_indexed_chain_event, get_latest_event_scanned_by_event_and_network, get_unprocessed_events_by_network, set_event_completed } from "./db/indexed_chain_event";
import {EventCreated, IndexedChainEvent, Network} from './db/_models';
import { add_network, get_all_networks, get_network_by_name } from "./db/networks";
import { get_sqs_message, send_sqs_message } from "./helpers/sqs";
import { activity_monitor } from "./lambdas/event_monitors/activity_monitor";
import { event_monitor } from "./lambdas/event_monitors/event_monitor";
import { event_created_processor } from "./lambdas/event_processors/event_created_processor";
import { offchain_data_processor } from "./lambdas/event_processors/offchain_data_processor";
import { ticket_minted_processor } from "./lambdas/event_processors/ticket_minted_processor";


// add_indexed_chain_event(indexedChainEvent)
// .then(r => console.log(r))
// .catch(e => console.log(e));

// add_created_event(createdEvent)
// .then(r => console.log(r))
// .catch(e => console.log(e))

// get_all_networks()
// .then(r => console.log(r))
// .catch(e => console.log(e))

// (async function() {
//     const message = get_sqs_message('activity_monitor', "Hello YOUU")

//     await send_sqs_message('activity_monitor', JSON.stringify(message))
// })()

// activityMonitor({'Records': [{'body': {}, 'attributes': {}}]}, {})

// (async function() {
//     const network = await get_latest_event_scanned_by_event_and_network('EventCreated', 'ETHEREUM')
//     console.log(network)
// })();

// (async function() {
//     const message = await eventMonitor({
//         'Records' : [
//             {
//                 'body': JSON.stringify({
//                     'MessageBody': {
//                         'event_name' : 'EventCreated', 
//                         'network_name': 'ETHEREUM'
//                     }
//                 })
//             }
//         ]
//         }, 
//         {}
//     )

// })()

(async function() {

    // const unprocessed_events = await get_unprocessed_events_by_network('638e62523a5d36509aeaef5d', 'EventCreated')
    // console.log(unprocessed_events)
    // await activity_monitor({}, {})

    // await event_created_processor({}, {})
    // await offchain_data_processor({}, {});
    // await ticket_minted_processor({}, {});

    const latest = await get_latest_event_scanned_by_event_and_network('EventCreated', 'ETHEREUM')
    console.log(latest)
})()


import { ethers } from "ethers";
import {
  contract_addresses,
  contract_creation_block,
} from "../../config/chain_config";
import {
  add_indexed_chain_event,
  get_latest_event_scanned_by_event_and_network,
} from "../../db/indexed_chain_event";
import { get_network_by_name } from "../../db/networks";
import { getClient } from "../../db/_connection";
import { IndexedChainEvent } from "../../db/_models";
import { get_past_events } from "../../helpers/web3_events";
import { event_created_processor } from "../event_processors/event_created_processor";
import { offchain_data_processor } from "../event_processors/offchain_data_processor";
import { ticket_minted_processor } from "../event_processors/ticket_minted_processor";
import {
  LambdaClient,
  InvokeCommand,
  InvokeCommandInput,
} from "@aws-sdk/client-lambda";

const event_to_processor = {
  'EventCreated': 'eventCreatedProcessor',
  'OffchainDataUpdated': 'offchainDataProcessor',
  'TransferSingle': 'ticketMintedProcessor',
};

async function event_monitor(event: {}, context: {}) {
  const records = event["Records"];
  const body = JSON.parse(records[0]["body"]);
  const message = body["MessageBody"];

  const event_name = message["event_name"];
  const network_name = message["network_name"];

  if ([event_name, network_name].some((v) => !v)) {
    throw "Missing required field !";
  }

  const env = process.env["ENV"]!;

  const network = await get_network_by_name(network_name);

  let block_number: number;

  const latest_event_scanned =
    await get_latest_event_scanned_by_event_and_network(
      event_name,
      network_name
    );

  if (latest_event_scanned) {
    block_number = latest_event_scanned.block_number + 1;
  } else {
    block_number = contract_creation_block[env][network_name];
  }

  const provider = new ethers.providers.JsonRpcProvider(network.rpc_url);

  const latest_events = await get_past_events(
    provider,
    network,
    event_name,
    block_number
  );
  console.log("LATEST EVENTS: ", latest_events)

  console.log(event_to_processor)
  console.log("EVENT NAME: ", event_name)
  for (let event of latest_events) {
    let indexed_chain_event: IndexedChainEvent = {
      block_number: event["block_number"],
      dictionary_attributes: event["args"],
      tx_hash: event["tx_hash"],
      contract_address: contract_addresses.billeterie[env][network_name],
      created_at: Math.floor(Date.now() / 1000),
      event_name: event_name,
      network_id: (network as any)._id,
      completed: false,
      updated_at: null,
    };

    const new_event_scanned = await add_indexed_chain_event(
      indexed_chain_event
    );
    console.log("NEW EVENT SCANNED: ", new_event_scanned);
  }

  await getClient().close();
 
  const lambda = new LambdaClient({});
  console.log("Invoking: ", event_to_processor[event_name])

  const command = new InvokeCommand({
    FunctionName: `billeterie-backend-${env}-${event_to_processor[event_name]}`,
    InvocationType: 'RequestResponse',
  })
  await lambda.send(command);

}

export { event_monitor };

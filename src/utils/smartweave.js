import { arweave } from "./arweave.js";
import {
  LoggerFactory,
  RedstoneGatewayInteractionsLoader,
  SmartWeaveNodeFactory,
} from "redstone-smartweave";
import { ANS_CONTRACT_ADDRESS, REDSTONE_GATEWAY_URL } from "./constants.js";

export async function loadAnsContractState(state_type) {
  const sw = SmartWeaveNodeFactory.memCachedBased(arweave)
    .setInteractionsLoader(
      new RedstoneGatewayInteractionsLoader(REDSTONE_GATEWAY_URL)
    )
    .build();

  const contract = sw.contract(ANS_CONTRACT_ADDRESS);
  const { state, validity } = await contract.readState();

  // safe mode - loading only the confirmed interactions
  const swConfirmed = SmartWeaveNodeFactory.memCachedBased(arweave)
    .setInteractionsLoader(
      new RedstoneGatewayInteractionsLoader(REDSTONE_GATEWAY_URL, {
        confirmed: true,
      })
    )
    .build();

  const contractSafe = swConfirmed.contract(ANS_CONTRACT_ADDRESS);
  const { state: stateSafe, validity: validitySafe } =
    await contractSafe.readState();

  switch (state_type) {
    case "safe":
      return stateSafe;
    case "default":
      return state;
    default:
      return stateSafe;
  }
}

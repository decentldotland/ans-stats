import base64url from "base64url";
import NodeCache from "node-cache";
import { arweave, timeout } from "./arweave.js";
import { loadAnsContractState } from "./smartweave.js";
import { getLastInteraction } from "./gql.js";
import { STATS_PENDING } from "./constants.js";
import { statsFeed } from "./stats.js";
// initialize cache'ing class instance
const base64Cache = new NodeCache();

async function cache() {
  const lastInteraction = (await getLastInteraction())[0]?.block;
  const currentBlock = (await arweave.blocks.getCurrent())?.height;

  // initialization
  if (!base64Cache.has("state")) {
    const state = await loadAnsContractState("safe");
    const stats = await statsFeed();

    base64Cache.set("state", base64url(JSON.stringify({ res: state.users })));
    base64Cache.set("stats", stats);
    base64Cache.set("height", currentBlock);

    console.log(`STATE ALREADY CACHED - HEIGHT: ${base64Cache.get("height")}`);
  }

  // cache new interactions
  if (
    !base64Cache.get("height") ||
    base64Cache.get("height") < lastInteraction
  ) {
    const state = await loadAnsContractState("safe");
    base64Cache.set("state", base64url(JSON.stringify({ res: state.users })));
    base64Cache.set("height", currentBlock);

    console.log(`NEW STATE CACHED - HEIGHT: ${lastInteraction}`);
  }

  // keep caching the statsFeed
  const stats = await statsFeed();
  base64Cache.set("stats", stats);
  console.log(`NEW STAT CACHED - HEIGHT: ${lastInteraction}`);
}

export async function getAnsState() {
  if (!base64Cache.has("state")) {
    return "e30";
  }

  return base64Cache.get("state");
}

export async function getStats() {
  if (!base64Cache.has("stats")) {
    return base64url(JSON.stringify(STATS_PENDING));
  }

  return base64Cache.get("stats");
}

export async function polling() {
  try {
    while (true) {
      await cache();
      await timeout();
    }
  } catch (error) {
    console.log(error);
  }
}

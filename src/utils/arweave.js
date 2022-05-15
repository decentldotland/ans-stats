import Arweave from "arweave";
import axios from "axios";
import { BLOCK_SLEEPING_TIMEOUT, WALLET_LIST } from "./constants.js";

export const arweave = new Arweave.init({
  host: "arweave.net",
  protocol: "https",
  port: 443,
  timeout: 60000,
  logging: false,
});

export function timeout() {
  // a block is ~ 2 min
  const ms = BLOCK_SLEEPING_TIMEOUT * 2 * 60 * 1e3;
  console.log(
    `\nsleeping for ${BLOCK_SLEEPING_TIMEOUT} network blocks or ${ms} ms\n`
  );
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getWalletList() {
  try {
    const wallet_list = (await axios.get(WALLET_LIST))?.data;
    return wallet_list;
  } catch (error) {
    console.log(error);
  }
}

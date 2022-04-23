import redstone from "redstone-api";
import base64url from "base64url";
import { getAnsState } from "./cache.js";
import { arweave } from "./arweave.js";

async function getUsersCount() {
  try {
    const encodedState = await getAnsState();
    const state = JSON.parse(base64url.decode(encodedState));

    if (encodedState === "e30") {
      return "pending";
    }

    const usersCount = state["res"].length;
    return usersCount;
  } catch (error) {
    console.log(error);
  }
}

async function getUsersBalances() {
  try {
    let totalBalances = 0;
    const encodedState = await getAnsState();
    const arTokenRate = (await redstone.getPrice("AR"))?.value;
    const state = JSON.parse(base64url.decode(encodedState));

    if (encodedState === "e30") {
      return {
        ar: "pending",
        usd: "pending",
      };
    }

    let ar_balance;

    for (let user of state.res) {
      const userBalance = await arweave.wallets.getBalance(user.user);
      totalBalances += Number(userBalance);
    }

    totalBalances *= 1e-12;

    return {
      ar: totalBalances,
      usd: totalBalances * arTokenRate,
    };
  } catch (error) {
    console.log(error);
  }
}

export async function statsFeed() {
  try {
    const usersCount = await getUsersCount();
    const { ar, usd } = await getUsersBalances();

    const res = {
      users_count: usersCount,
      value_held_by_users: {
        ar: ar,
        usd: usd,
      },
    };

    return base64url(JSON.stringify(res));
  } catch (error) {
    console.log(error);
  }
}

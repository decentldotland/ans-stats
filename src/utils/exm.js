import axios from "axios";
import base64url from "base64url";
async function arPageUser(user) {
  try {
    const delKeys = ["address", "primary_domain", "ownedDomains", "color"];
    user.user = user.address;
    user.currentLabel = user.primary_domain;
    user.ownedLabels = user.ownedDomains;
    for (const domain of user.ownedLabels) {
      domain.label = domain.domain;
    }

    user.nickname = `${user.primary_domain}.ar`;
    user.bio = `an Arweaver from the permaweb`;
    user.address_color = user.ownedLabels[0].color;
//     user.avatar = user.avatar ? user.avatar : "pOOhf_k7ZFT3LwdQz1Fa2ltBzVgriFw4N1hJkG3GYUA";
    user.avatar = "";
    user.links = {};

    for (const key of delKeys) {
      delete user[key];
    }

    return user;
  } catch (error) {
    console.log(error);
    return user;
  }
}

export async function getAnsExmState() {
  try {
    const newState = [];
    const state = (await axios.get(`https://api.exm.dev/read/VGWeJLDLJ9ify3ezl9tW-9fhB0G-GIUd60FE-5Q-_VI`))?.data;
    for (const user of state.balances) {
      const migrated = await arPageUser(user);
      newState.push(migrated)
    }
    return base64url(JSON.stringify({res: newState}));
  } catch(error) {
    console.log(error);
    return error;
  }
}

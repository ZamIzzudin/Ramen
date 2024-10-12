/** @format */

import EC from "../utils/key";

export function getWallet(pvt: string) {
  return EC.keyFromPrivate(pvt);
}

export function parsedWallet(pub: string) {
  return EC.keyFromPublic(pub, "hex");
}

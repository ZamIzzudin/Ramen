/** @format */

import EC from "../utils/key";

export function getWallet(pvt: string) {
  return EC.keyFromPrivate(pvt);
}

/** @format */

import { SHA256 } from "crypto-js";
import hexToBin from "hex-to-bin";

export function hasherBinary(value: string) {
  return hexToBin(SHA256(value).toString());
}

export function hasherHex(value: string) {
  return SHA256(value).toString();
}

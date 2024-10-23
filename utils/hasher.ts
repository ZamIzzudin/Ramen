/** @format */

import { SHA256 } from "crypto-js";

export function hasherBinary(value: string) {
  return messageToBinary(SHA256(value).toString());
}

export function hasherHex(value: string) {
  return SHA256(value).toString();
}

function messageToBinary(message: string) {
  let binaryMessage = "";
  for (let i = 0; i < message.length; i++) {
    const charCode = message.charCodeAt(i);
    binaryMessage += charCode.toString(2).padStart(8, "0");
  }
  return binaryMessage;
}

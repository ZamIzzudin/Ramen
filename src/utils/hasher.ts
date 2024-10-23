/** @format */

import sha256 from "crypto-js/sha256";

export function hasherBinary(value: string) {
  return messageToBinary(sha256(value).toString());
}

export function hasherHex(value: string) {
  return sha256(value).toString();
}

function messageToBinary(message: string) {
  let binaryMessage = "";
  for (let i = 0; i < message.length; i++) {
    const charCode = message.charCodeAt(i);
    binaryMessage += charCode.toString(2).padStart(8, "0");
  }
  return binaryMessage;
}

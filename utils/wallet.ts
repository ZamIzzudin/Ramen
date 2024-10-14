/** @format */

import { ec } from "elliptic";
const elliptic = new ec("secp256k1");
import Wallet from "../service/Wallet";
import { hasherHex } from "./hasher";

interface dataState {
  [key: string]: number;
}

export const EC = elliptic;

export function generateWallet() {
  return new Wallet();
}

export function parsedWallet(pub: string) {
  return elliptic.keyFromPublic(pub, "hex");
}

export function validateSignature(
  address: string,
  data: dataState,
  signature: string
) {
  const wallet = parsedWallet(address);
  const hashed = hasherHex(JSON.stringify(data));

  return wallet.verify(hashed, signature);
}

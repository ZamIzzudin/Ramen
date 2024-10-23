/** @format */

import elliptic from "elliptic";
const ec = new elliptic.ec("secp256k1");

import { hasherHex } from "./hasher.js";

import Wallet from "../service/Wallet.js";
import Block from "../service/Block.js";

export const EC = ec;

export function generateWallet() {
  return new Wallet();
}

export function parsedWallet(pub: string) {
  return ec.keyFromPublic(pub, "hex");
}

export function validateSignature(
  from: string,
  to: string,
  amount: number,
  type: string,
  signature: string
) {
  const wallet = parsedWallet(from);

  const hashed = hasherHex(JSON.stringify({ from, to, amount, type }));

  return wallet.verify(hashed, signature);
}

export function calculateBalance(chain: Block[], address: string) {
  let balance = 0;

  chain.forEach((block) => {
    block.transaction.forEach((transaction) => {
      if (transaction.from === address) {
        balance -= transaction.amount;
      }

      if (transaction.to === address) {
        balance += transaction.amount;
      }
    });
  });

  return balance;
}

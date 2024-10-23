/** @format */

import { ec } from "elliptic";
const elliptic = new ec("secp256k1");
import { hasherHex } from "./hasher";

import Wallet from "../service/Wallet";
import Block from "../service/Block";

export const EC = elliptic;

export function generateWallet() {
  return new Wallet();
}

export function parsedWallet(pub: string) {
  return elliptic.keyFromPublic(pub, "hex");
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

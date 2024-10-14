/** @format */
import { ec } from "elliptic";

import Block from "./Block";
import Transaction from "./Transaction";
import { EC } from "../utils/wallet";
import { hasherHex } from "../utils/hasher";

interface dataState {
  [key: string]: number;
}

export default class Wallet {
  keyPair: ec.KeyPair;
  publicKey: string;
  balance: number;

  constructor(balance = 1000) {
    this.keyPair = EC.genKeyPair();

    this.publicKey = this.keyPair.getPublic("hex");

    this.balance = balance;
  }

  sign(data: dataState) {
    return this.keyPair.sign(hasherHex(JSON.stringify(data))).toDER("hex");
  }

  initTransaction(to: string, amount: number, chain: Block[]) {
    if (chain) {
      this.balance = this.calculateBalance();
    }

    if (amount > this.balance) {
      throw new Error("Amount exceeds balance");
    }

    return new Transaction(this, to, amount);
  }

  calculateBalance() {
    return this.balance;
  }
}

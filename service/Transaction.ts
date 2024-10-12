/** @format */

import { hasherHex } from "../utils/hasher";
import { ec } from "elliptic";

type Wallet = ec.KeyPair;

export default class Transaction {
  from: string;
  to: string;
  data: any;
  signature: string;

  constructor(from: string, to: string, data: any) {
    this.from = from;
    this.to = to;
    this.data = data;
    this.signature = "";
  }

  generateHash() {
    return hasherHex(`${this.from}${this.to}${this.data}`);
  }

  signTransaction(wallet: Wallet) {
    if (wallet.getPublic("hex") !== this.from) {
      throw new Error("Failed to Sign Transaction, Key not Valid");
    }

    const hashed = this.generateHash();
    const sign = wallet.sign(hashed, "base64");
    this.signature = sign.toDER("hex");
  }
}

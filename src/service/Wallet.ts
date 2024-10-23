/** @format */
import { ec } from "elliptic";

import { calculateBalance } from "../utils/wallet.js";
import { EC } from "../utils/wallet.js";
import { hasherHex } from "../utils/hasher.js";

interface dataState {
  from: string;
  to: string;
  amount: number;
  type: string;
}

export default class Wallet {
  keyPair: ec.KeyPair;
  publicKey: string;

  constructor() {
    this.keyPair = EC.genKeyPair();

    this.publicKey = this.keyPair.getPublic("hex");
  }

  sign(data: dataState) {
    return this.keyPair.sign(hasherHex(JSON.stringify(data))).toDER("hex");
  }
}
